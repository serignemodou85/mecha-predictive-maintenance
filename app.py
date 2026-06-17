"""
MECHA - API REST de maintenance prédictive
Auteur : Équipe MSPR TPRE841
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pickle, json, os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

BASE      = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, 'models')

app = Flask(__name__)
CORS(app)

# ── Chargement des modèles ────────────────────────────────────────────────────
def load_models():
    with open(os.path.join(MODEL_DIR, 'mecha_classifier.pkl'), 'rb') as f:
        clf = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'mecha_regressor.pkl'), 'rb') as f:
        reg = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'metrics.json')) as f:
        metrics = json.load(f)
    xgb_path = os.path.join(MODEL_DIR, 'mecha_xgb_classifier.pkl')
    xgb = None
    if os.path.exists(xgb_path):
        with open(xgb_path, 'rb') as f:
            xgb = pickle.load(f)
    return clf, reg, xgb, metrics

clf, reg, xgb_clf, model_metrics = load_models()

SEQ_LEN = 20

def _load_lstm():
    try:
        import tensorflow as tf
        tf.get_logger().setLevel('ERROR')
        lstm_path   = os.path.join(MODEL_DIR, 'mecha_lstm_regressor.keras')
        scaler_path = os.path.join(MODEL_DIR, 'mecha_lstm_scaler.pkl')
        if os.path.exists(lstm_path) and os.path.exists(scaler_path):
            model = tf.keras.models.load_model(lstm_path)
            with open(scaler_path, 'rb') as f:
                scaler = pickle.load(f)
            return model, scaler
    except Exception:
        pass
    return None, None

lstm_reg, lstm_scaler = _load_lstm()

FEATURES = [
    'temp_air_C', 'temp_process_C', 'delta_temp_C',
    'vitesse_rotation_rpm', 'couple_Nm', 'usure_outil_min',
    'puissance_W', 'ratio_couple_vitesse',
    'type_piece_L', 'type_piece_M',
]

SEUIL_ALERTE   = 0.45
SEUIL_CRITIQUE = 0.70
RUL_SEUIL_ROUGE = 30

# ── Utilitaires ───────────────────────────────────────────────────────────────
def extract_features(data: dict) -> list:
    t_air  = float(data.get('temp_air_C', 25))
    t_proc = float(data.get('temp_process_C', 35))
    vit    = float(data.get('vitesse_rotation_rpm', 1500))
    couple = float(data.get('couple_Nm', 40))
    usure  = float(data.get('usure_outil_min', 0))
    type_piece = str(data.get('type_piece', 'M'))

    delta    = round(t_proc - t_air, 2)
    puissance = round(vit * couple * 2 * 3.14159 / 60, 2)
    ratio    = round(couple / (vit + 1), 4)
    type_L   = 1 if type_piece == 'L' else 0
    type_M   = 1 if type_piece == 'M' else 0

    return [t_air, t_proc, delta, vit, couple, usure, puissance, ratio, type_L, type_M]

def _predict_lstm_rul(feats: list) -> float:
    feat_arr    = np.array(feats, dtype=np.float32).reshape(1, -1)
    feat_scaled = lstm_scaler.transform(feat_arr)
    seq         = np.tile(feat_scaled, (SEQ_LEN, 1))[np.newaxis]
    return float(lstm_reg.predict(seq, verbose=0)[0][0])


def date_panne_estimee(rul_min: float) -> str:
    dt = datetime.now() + timedelta(minutes=rul_min)
    return dt.strftime('%d/%m/%Y à %H:%M')


def niveau_alerte(prob: float, rul: float) -> str:
    if prob >= SEUIL_CRITIQUE or rul < RUL_SEUIL_ROUGE:
        return 'CRITIQUE'
    elif prob >= SEUIL_ALERTE or rul < 60:
        return 'ATTENTION'
    return 'NORMAL'

def recommandation(alerte: str, rul: float) -> str:
    if alerte == 'CRITIQUE':
        return f"Arrêt machine recommandé. RUL estimé : {rul:.0f} min. Planifier intervention immédiate."
    elif alerte == 'ATTENTION':
        return f"Surveiller. Planifier maintenance dans les {rul:.0f} minutes restantes."
    return "Machine en état nominal. Prochaine révision selon calendrier préventif."

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route('/')
def dashboard():
    return render_template('dashboard_mecha.html')

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'MECHA Predictive Maintenance API'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data  = request.get_json(force=True)
        feats = extract_features(data)
        X     = pd.DataFrame([feats], columns=FEATURES)

        model_choice = str(data.get('model', 'rf')).lower()
        active_clf   = xgb_clf if (model_choice == 'xgb' and xgb_clf is not None) else clf
        modele_clf   = 'xgboost' if (model_choice == 'xgb' and xgb_clf is not None) else 'random_forest'

        prob  = float(active_clf.predict_proba(X)[0][1])
        panne = int(active_clf.predict(X)[0])

        if model_choice == 'lstm' and lstm_reg is not None:
            rul        = _predict_lstm_rul(feats)
            modele_reg = 'lstm'
        else:
            rul        = float(reg.predict(X)[0])
            modele_reg = 'random_forest'

        modele_nom = f'{modele_clf}+{modele_reg}' if modele_reg != modele_clf else modele_clf
        alerte = niveau_alerte(prob, rul)

        return jsonify({
            'machine_id': data.get('machine_id', 'N/A'),
            'usine':      data.get('usine', 'N/A'),
            'modele_utilise':      modele_nom,
            'prediction': {
                'panne_detectee':    bool(panne),
                'probabilite_panne': round(prob, 4),
                'RUL_min':           round(rul, 1),
                'date_panne_estimee': date_panne_estimee(rul),
                'niveau_alerte':     alerte,
            },
            'recommandation':    recommandation(alerte, rul),
            'features_utilisees': dict(zip(FEATURES, feats)),
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        payload      = request.get_json(force=True)
        records      = payload if isinstance(payload, list) else payload.get('machines', payload)
        model_choice = (payload.get('model', 'rf') if isinstance(payload, dict) else 'rf').lower()
        active_clf   = xgb_clf if (model_choice == 'xgb' and xgb_clf is not None) else clf
        results = []
        for rec in records:
            feats  = extract_features(rec)
            X      = pd.DataFrame([feats], columns=FEATURES)
            prob   = float(active_clf.predict_proba(X)[0][1])
            panne  = int(active_clf.predict(X)[0])
            rul    = float(reg.predict(X)[0])
            alerte = niveau_alerte(prob, rul)
            results.append({
                'machine_id':        rec.get('machine_id'),
                'probabilite_panne': round(prob, 4),
                'RUL_min':           round(rul, 1),
                'date_panne_estimee': date_panne_estimee(rul),
                'niveau_alerte':     alerte,
            })
        return jsonify({'count': len(results), 'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/metrics')
def metrics():
    return jsonify(model_metrics)

@app.route('/plot/<path:filename>')
def serve_plot(filename):
    return send_from_directory(os.path.join(BASE, 'docs'), filename)

# ── Lancement ─────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("\n✅  MECHA API démarrée")
    print("📊  Dashboard : http://127.0.0.1:5000")
    print("🔌  API       : http://127.0.0.1:5000/health\n")
    app.run(host='0.0.0.0', port=5000, debug=False)
