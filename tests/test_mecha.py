"""
MECHA - Tests unitaires et d'intégration
Auteur : Équipe MSPR TPRE841
"""

import sys, os
import json
import pickle
import pytest
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

SAMPLE_OK = {
    'machine_id': 'M001',
    'usine': 'FR-Lyon',
    'temp_air_C': 25.0,
    'temp_process_C': 35.0,
    'vitesse_rotation_rpm': 1500,
    'couple_Nm': 40.0,
    'usure_outil_min': 20,
    'type_piece': 'M',
}

SAMPLE_PANNE = {
    'machine_id': 'M002',
    'usine': 'ES-Madrid',
    'temp_air_C': 30.0,
    'temp_process_C': 55.0,
    'vitesse_rotation_rpm': 2700,
    'couple_Nm': 70.0,
    'usure_outil_min': 250,
    'type_piece': 'L',
}


# ─── Tests données ────────────────────────────────────────────────────────────

class TestData:
    def test_ml_dataset_exists(self):
        path = os.path.join(DATA_DIR, 'mecha_ml_dataset.csv')
        assert os.path.exists(path), "mecha_ml_dataset.csv introuvable"

    def test_ml_dataset_shape(self):
        import pandas as pd
        df = pd.read_csv(os.path.join(DATA_DIR, 'mecha_ml_dataset.csv'))
        assert len(df) == 10000, f"Attendu 10000 lignes, obtenu {len(df)}"
        assert 'panne_machine' in df.columns
        assert 'RUL_min' in df.columns

    def test_ml_dataset_no_nulls(self):
        import pandas as pd
        df = pd.read_csv(os.path.join(DATA_DIR, 'mecha_ml_dataset.csv'))
        assert df.isnull().sum().sum() == 0, "Valeurs manquantes détectées"

    def test_class_imbalance_reasonable(self):
        import pandas as pd
        df = pd.read_csv(os.path.join(DATA_DIR, 'mecha_ml_dataset.csv'))
        pct_panne = df['panne_machine'].mean()
        assert 0.01 < pct_panne < 0.20, f"Taux de panne inattendu : {pct_panne:.2%}"


# ─── Tests modèles ────────────────────────────────────────────────────────────

class TestModels:
    def _load(self):
        with open(os.path.join(MODEL_DIR, 'mecha_classifier.pkl'), 'rb') as f:
            clf = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'mecha_regressor.pkl'), 'rb') as f:
            reg = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'metrics.json')) as f:
            metrics = json.load(f)
        return clf, reg, metrics

    def test_models_exist(self):
        assert os.path.exists(os.path.join(MODEL_DIR, 'mecha_classifier.pkl'))
        assert os.path.exists(os.path.join(MODEL_DIR, 'mecha_regressor.pkl'))
        assert os.path.exists(os.path.join(MODEL_DIR, 'mecha_xgb_classifier.pkl'))
        assert os.path.exists(os.path.join(MODEL_DIR, 'mecha_lstm_regressor.keras'))
        assert os.path.exists(os.path.join(MODEL_DIR, 'mecha_lstm_scaler.pkl'))
        assert os.path.exists(os.path.join(MODEL_DIR, 'metrics.json'))

    def test_classifier_auc(self):
        _, _, metrics = self._load()
        auc = metrics['classification']['auc_roc']
        assert auc >= 0.85, f"AUC insuffisant : {auc}"

    def test_regressor_r2(self):
        _, _, metrics = self._load()
        r2 = metrics['regression']['r2']
        assert r2 >= 0.80, f"R² insuffisant : {r2}"

    def test_classifier_predict_shape(self):
        clf, _, _ = self._load()
        X = np.array([[25, 35, 10, 1500, 40, 20, 6283, 0.026, 0, 1]])
        pred = clf.predict(X)
        proba = clf.predict_proba(X)
        assert pred.shape == (1,)
        assert proba.shape == (1, 2)
        assert 0 <= proba[0][1] <= 1

    def test_classifier_output_binary(self):
        clf, _, _ = self._load()
        X = np.array([[25, 35, 10, 1500, 40, 20, 6283, 0.026, 0, 1]])
        pred = clf.predict(X)
        assert pred[0] in [0, 1]

    def test_regressor_positive_rul(self):
        _, reg, _ = self._load()
        X = np.array([[25, 35, 10, 1500, 40, 20, 6283, 0.026, 0, 1]])
        rul = reg.predict(X)[0]
        assert rul >= 0, f"RUL négatif : {rul}"

    def test_xgb_classifier_auc(self):
        _, _, metrics = self._load()
        auc = metrics['xgb_classification']['auc_roc']
        assert auc >= 0.85, f"XGB AUC insuffisant : {auc}"

    def test_lstm_r2(self):
        _, _, metrics = self._load()
        r2 = metrics['lstm_regression']['r2']
        assert r2 >= 0.80, f"LSTM R² insuffisant : {r2}"


# ─── Tests API ────────────────────────────────────────────────────────────────

class TestAPI:
    @pytest.fixture
    def client(self):
        from app import app
        app.config['TESTING'] = True
        with app.test_client() as c:
            yield c

    def test_health(self, client):
        r = client.get('/health')
        assert r.status_code == 200
        data = r.get_json()
        assert data['status'] == 'ok'

    def test_predict_nominal(self, client):
        r = client.post('/predict', json=SAMPLE_OK)
        assert r.status_code == 200
        data = r.get_json()
        assert 'prediction' in data
        assert 'probabilite_panne' in data['prediction']
        assert 0 <= data['prediction']['probabilite_panne'] <= 1
        assert data['prediction']['RUL_min'] >= 0
        assert data['prediction']['niveau_alerte'] in ['NORMAL', 'ATTENTION', 'CRITIQUE']

    def test_predict_panne(self, client):
        r = client.post('/predict', json=SAMPLE_PANNE)
        assert r.status_code == 200
        data = r.get_json()
        # La machine dégradée devrait avoir un RUL bas
        assert data['prediction']['RUL_min'] < 200

    def test_predict_batch(self, client):
        r = client.post('/predict/batch', json=[SAMPLE_OK, SAMPLE_PANNE])
        assert r.status_code == 200
        data = r.get_json()
        assert data['count'] == 2
        assert len(data['results']) == 2

    def test_metrics_endpoint(self, client):
        r = client.get('/metrics')
        assert r.status_code == 200
        data = r.get_json()
        assert 'classification' in data
        assert 'regression' in data
        assert 'xgb_classification' in data
        assert 'lstm_regression' in data

    def test_predict_with_xgb(self, client):
        r = client.post('/predict', json={**SAMPLE_OK, 'model': 'xgb'})
        assert r.status_code == 200
        data = r.get_json()
        assert 'xgboost' in data.get('modele_utilise', '')

    def test_plot_route_exists(self, client):
        r = client.get('/plot/roc_curve_4models.png')
        assert r.status_code == 200

    def test_plot_route_missing(self, client):
        r = client.get('/plot/fichier_inexistant.png')
        assert r.status_code == 404

    def test_predict_missing_fields(self, client):
        r = client.post('/predict', json={})
        assert r.status_code == 200  # valeurs par défaut utilisées


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
