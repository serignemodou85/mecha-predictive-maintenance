"""
MECHA - Entraînement des modèles IA de maintenance prédictive
  - Modèle 1 : Classification (panne / normal) — Random Forest
  - Modèle 2 : Régression (RUL - Remaining Useful Life) — Random Forest Regressor
Auteur : Équipe MSPR TPRE841
"""

import os
import json
import pickle
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold, GridSearchCV, learning_curve
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression, LinearRegression, SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import (
    classification_report, confusion_matrix,
    accuracy_score, f1_score, roc_auc_score, roc_curve,
    mean_absolute_error, mean_squared_error, r2_score
)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'mecha_ml_dataset.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models')
PLOT_PATH = os.path.join(os.path.dirname(__file__), '..', 'docs')

FEATURES = [
    'temp_air_C', 'temp_process_C', 'delta_temp_C',
    'vitesse_rotation_rpm', 'couple_Nm', 'usure_outil_min',
    'puissance_W', 'ratio_couple_vitesse',
    'type_piece_L', 'type_piece_M',
]
SEQ_LEN = 20

# ─── Couleurs MECHA ───────────────────────────────────────────────────────────
C_BLUE   = '#1D9E75'
C_RED    = '#D85A30'
C_GRAY   = '#888780'
C_AMBER  = '#BA7517'
C_LIGHT  = '#F1EFE8'


def load_data():
    df = pd.read_csv(DATA_PATH)
    X = df[FEATURES]
    y_clf = df['panne_machine']
    y_reg = df['RUL_min']
    return X, y_clf, y_reg


# ─── MODÈLE 1 : CLASSIFICATION ───────────────────────────────────────────────

def train_classifier(X, y):
    print("\n======= MODÈLE 1 : Classification (panne/normal) =======")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # GridSearchCV — recherche des meilleurs hyperparamètres
    print("GridSearchCV en cours (3-fold, 12 combinaisons)...")
    param_grid = {
        'n_estimators':     [100, 200],
        'max_depth':        [8, 12, 16],
        'min_samples_split':[2, 5],
    }
    grid = GridSearchCV(
        RandomForestClassifier(class_weight='balanced', random_state=42, n_jobs=-1),
        param_grid, cv=3, scoring='f1', n_jobs=-1, verbose=0
    )
    grid.fit(X_train, y_train)
    print(f"Meilleurs paramètres : {grid.best_params_}  |  F1 CV : {grid.best_score_:.4f}")
    rf = grid.best_estimator_

    # Logistic Regression (modèle de comparaison)
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)
    lr = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    lr.fit(X_train_s, y_train)

    # Évaluation
    y_pred_rf = rf.predict(X_test)
    y_pred_lr = lr.predict(X_test_s)
    y_prob_rf = rf.predict_proba(X_test)[:, 1]

    print("\n--- Random Forest ---")
    print(classification_report(y_test, y_pred_rf, target_names=['Normal', 'Panne']))
    auc = roc_auc_score(y_test, y_prob_rf)
    f1  = f1_score(y_test, y_pred_rf)
    acc = accuracy_score(y_test, y_pred_rf)
    print(f"AUC-ROC : {auc:.4f}  |  F1 : {f1:.4f}  |  Accuracy : {acc:.4f}")

    print("\n--- Logistic Regression (comparaison) ---")
    print(f"F1 : {f1_score(y_test, y_pred_lr):.4f}  |  Accuracy : {accuracy_score(y_test, y_pred_lr):.4f}")

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(rf, X, y, cv=cv, scoring='f1', n_jobs=-1)
    print(f"\nCV F1 (5-fold) : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    metrics = {
        'accuracy': round(float(acc), 4),
        'f1_score': round(float(f1), 4),
        'auc_roc': round(float(auc), 4),
        'cv_f1_mean': round(float(cv_scores.mean()), 4),
        'cv_f1_std': round(float(cv_scores.std()), 4),
    }

    _plot_confusion(y_test, y_pred_rf, 'Matrice de confusion — Classificateur (Random Forest)')
    _plot_importance(rf, X.columns, 'Importance des features — Classification')
    _plot_roc(y_test, y_prob_rf, auc)
    _plot_learning_curve(rf, X, y)

    return rf, metrics, X_test, y_test, y_pred_rf, y_prob_rf


# ─── MODÈLE 2 : RÉGRESSION RUL ───────────────────────────────────────────────

def train_regressor(X, y):
    print("\n======= MODÈLE 2 : Régression RUL =======")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Random Forest Regressor
    rf = RandomForestRegressor(
        n_estimators=200, max_depth=15, min_samples_split=5,
        random_state=42, n_jobs=-1
    )
    rf.fit(X_train, y_train)

    # Régression linéaire (comparaison)
    lr = LinearRegression()
    lr.fit(X_train, y_train)

    y_pred_rf = rf.predict(X_test)
    y_pred_lr = lr.predict(X_test)

    mae_rf  = mean_absolute_error(y_test, y_pred_rf)
    rmse_rf = np.sqrt(mean_squared_error(y_test, y_pred_rf))
    r2_rf   = r2_score(y_test, y_pred_rf)

    mae_lr  = mean_absolute_error(y_test, y_pred_lr)
    r2_lr   = r2_score(y_test, y_pred_lr)

    print(f"\n--- Random Forest ---")
    print(f"MAE : {mae_rf:.2f} min  |  RMSE : {rmse_rf:.2f} min  |  R² : {r2_rf:.4f}")
    print(f"\n--- Régression linéaire (comparaison) ---")
    print(f"MAE : {mae_lr:.2f} min  |  R² : {r2_lr:.4f}")

    metrics = {
        'mae': round(float(mae_rf), 2),
        'rmse': round(float(rmse_rf), 2),
        'r2': round(float(r2_rf), 4),
    }

    _plot_rul_pred(y_test, y_pred_rf)

    return rf, metrics


# ─── MODÈLE 3 : XGBOOST CLASSIFICATION ──────────────────────────────────────

def train_xgb_classifier(X, y):
    print("\n======= MODÈLE XGBoost : Classification (panne/normal) =======")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    n_neg = int((y_train == 0).sum())
    n_pos = int((y_train == 1).sum())
    scale_pos_weight = n_neg / n_pos
    print(f"scale_pos_weight : {scale_pos_weight:.1f}  ({n_neg} normaux / {n_pos} pannes)")

    xgb = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric='logloss',
        verbosity=0,
        n_jobs=-1,
    )
    xgb.fit(X_train, y_train)

    y_pred = xgb.predict(X_test)
    y_prob = xgb.predict_proba(X_test)[:, 1]

    f1  = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    acc = accuracy_score(y_test, y_pred)

    print("\n--- XGBoost ---")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Panne']))
    print(f"AUC-ROC : {auc:.4f}  |  F1 : {f1:.4f}  |  Accuracy : {acc:.4f}")

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(xgb, X, y, cv=cv, scoring='f1', n_jobs=-1)
    print(f"CV F1 (5-fold) : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    metrics = {
        'accuracy': round(float(acc), 4),
        'f1_score': round(float(f1), 4),
        'auc_roc': round(float(auc), 4),
        'cv_f1_mean': round(float(cv_scores.mean()), 4),
        'cv_f1_std': round(float(cv_scores.std()), 4),
    }

    return xgb, metrics, y_prob


# ─── MODÈLE 4 : LSTM RÉGRESSION RUL ─────────────────────────────────────────

def _build_sequences(df, seq_len=SEQ_LEN):
    """
    Construit des séquences temporelles par usine, triées par usure_outil_min
    (proxy temporel : plus l'usure est haute, plus la mesure est tardive).
    """
    from sklearn.preprocessing import StandardScaler as _SS
    scaler = _SS()
    X_scaled = scaler.fit_transform(df[FEATURES].values.astype(np.float32))
    df_s = df.copy()
    df_s[FEATURES] = X_scaled

    sequences, targets = [], []
    for usine, group in df_s.groupby('usine'):
        group_sorted = group.sort_values('usure_outil_min').reset_index(drop=True)
        X_u = group_sorted[FEATURES].values
        y_u = group_sorted['RUL_min'].values
        for i in range(len(X_u) - seq_len + 1):
            sequences.append(X_u[i:i + seq_len])
            targets.append(y_u[i + seq_len - 1])

    return (np.array(sequences, dtype=np.float32),
            np.array(targets,    dtype=np.float32),
            scaler)


def train_lstm_regressor(df):
    import os as _os
    _os.environ.setdefault('TF_ENABLE_ONEDNN_OPTS', '0')
    _os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')
    import tensorflow as tf
    tf.random.set_seed(42)
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from tensorflow.keras.callbacks import EarlyStopping

    print("\n======= MODÈLE LSTM : Régression RUL =======")

    X_seq, y_seq, scaler = _build_sequences(df)
    print(f"Séquences construites : {X_seq.shape}  "
          f"({SEQ_LEN} pas × {len(FEATURES)} features)")

    rng = np.random.default_rng(42)
    idx = rng.permutation(len(X_seq))
    split = int(len(idx) * 0.8)
    X_train, X_test = X_seq[idx[:split]], X_seq[idx[split:]]
    y_train, y_test = y_seq[idx[:split]], y_seq[idx[split:]]

    model = Sequential([
        LSTM(64, input_shape=(SEQ_LEN, len(FEATURES))),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(1),
    ], name='mecha_lstm_rul')
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    model.summary()

    early_stop = EarlyStopping(monitor='val_loss', patience=10,
                               restore_best_weights=True, verbose=1)
    model.fit(
        X_train, y_train,
        validation_split=0.1,
        epochs=100,
        batch_size=64,
        callbacks=[early_stop],
        verbose=1,
    )

    y_pred = model.predict(X_test, verbose=0).flatten()
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2   = r2_score(y_test, y_pred)

    print(f"\n--- LSTM RUL ---")
    print(f"MAE : {mae:.2f} min  |  RMSE : {rmse:.2f} min  |  R2 : {r2:.4f}")
    print(f"(Comparaison RF : MAE 4.19 | RMSE 5.29 | R2 0.9935)")

    _plot_lstm_rul_pred(y_test, y_pred)

    metrics = {
        'mae':     round(float(mae),  2),
        'rmse':    round(float(rmse), 2),
        'r2':      round(float(r2),   4),
        'seq_len': SEQ_LEN,
    }
    return model, scaler, metrics


# ─── VISUALISATIONS ──────────────────────────────────────────────────────────

def _plot_confusion(y_test, y_pred, title):
    cm = confusion_matrix(y_test, y_pred)
    fig, ax = plt.subplots(figsize=(5, 4))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    im = ax.imshow(cm, cmap='YlOrBr')
    ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
    ax.set_xticklabels(['Normal', 'Panne']); ax.set_yticklabels(['Normal', 'Panne'])
    ax.set_xlabel('Prédit', fontsize=11)
    ax.set_ylabel('Réel', fontsize=11)
    ax.set_title(title, fontsize=12, fontweight='bold', pad=12)
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i, j]), ha='center', va='center',
                    fontsize=16, fontweight='bold',
                    color='white' if cm[i, j] > cm.max()/2 else '#2C2C2A')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'confusion_matrix.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ confusion_matrix.png sauvegardée")


def _plot_importance(model, feature_names, title):
    imp = pd.Series(model.feature_importances_, index=feature_names).sort_values()
    colors = [C_BLUE if v > imp.median() else C_GRAY for v in imp.values]
    fig, ax = plt.subplots(figsize=(7, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    bars = ax.barh(imp.index, imp.values, color=colors, edgecolor='white', height=0.6)
    ax.set_xlabel("Importance (Gini)", fontsize=11)
    ax.set_title(title, fontsize=12, fontweight='bold', pad=12)
    ax.spines[['top', 'right', 'left']].set_visible(False)
    ax.tick_params(axis='y', labelsize=9)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'feature_importance.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ feature_importance.png sauvegardée")


def _plot_roc(y_test, y_prob, auc):
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    ax.plot(fpr, tpr, color=C_BLUE, lw=2, label=f'Random Forest (AUC = {auc:.4f})')
    ax.plot([0, 1], [0, 1], '--', color=C_GRAY, lw=1.2, label='Aléatoire (AUC = 0.5)')
    ax.fill_between(fpr, tpr, alpha=0.08, color=C_BLUE)
    ax.set_xlabel('Taux de Faux Positifs', fontsize=11)
    ax.set_ylabel('Taux de Vrais Positifs', fontsize=11)
    ax.set_title('Courbe ROC — Classificateur', fontsize=12, fontweight='bold', pad=12)
    ax.legend(fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'roc_curve.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ roc_curve.png sauvegardée")


def _plot_roc_comparison(y_test, y_prob_rf, auc_rf, y_prob_xgb, auc_xgb):
    fpr_rf,  tpr_rf,  _ = roc_curve(y_test, y_prob_rf)
    fpr_xgb, tpr_xgb, _ = roc_curve(y_test, y_prob_xgb)
    C_XGB = '#7C3AED'
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    ax.plot(fpr_rf,  tpr_rf,  color=C_BLUE, lw=2, label=f'Random Forest (AUC = {auc_rf:.4f})')
    ax.plot(fpr_xgb, tpr_xgb, color=C_XGB,  lw=2, label=f'XGBoost       (AUC = {auc_xgb:.4f})')
    ax.plot([0, 1], [0, 1], '--', color=C_GRAY, lw=1.2, label='Aléatoire (AUC = 0.5)')
    ax.fill_between(fpr_rf,  tpr_rf,  alpha=0.06, color=C_BLUE)
    ax.fill_between(fpr_xgb, tpr_xgb, alpha=0.06, color=C_XGB)
    ax.set_xlabel('Taux de Faux Positifs', fontsize=11)
    ax.set_ylabel('Taux de Vrais Positifs', fontsize=11)
    ax.set_title('Courbe ROC — RF vs XGBoost', fontsize=12, fontweight='bold', pad=12)
    ax.legend(fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'roc_curve.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ roc_curve.png (comparaison RF vs XGBoost) sauvegardée")


def _plot_roc_4models(X_test, y_test_clf, y_prob_rf_clf, y_prob_xgb_clf, reg, lstm_model, lstm_scaler_obj):
    """ROC comparative : 2 classifieurs + RF Regressor + LSTM convertis via score RUL."""
    import tensorflow as _tf
    _tf.get_logger().setLevel('ERROR')

    X_df = X_test if hasattr(X_test, 'columns') else pd.DataFrame(X_test, columns=FEATURES)

    # RF Regressor → score risque = (260 − RUL) / 260
    rul_rf_reg   = reg.predict(X_df)
    score_rf_reg = np.clip((260 - rul_rf_reg) / 260, 0, 1)

    # LSTM → même conversion (séquence synthétique : répétition de chaque obs × SEQ_LEN)
    X_scaled  = lstm_scaler_obj.transform(X_df.values.astype(np.float32))
    X_seqs    = np.stack([np.tile(row, (SEQ_LEN, 1)) for row in X_scaled]).astype(np.float32)
    rul_lstm  = lstm_model.predict(X_seqs, verbose=0).flatten()
    score_lstm = np.clip((260 - rul_lstm) / 260, 0, 1)

    C_PURPLE = '#7C3AED'
    curves = [
        ('Random Forest Classifier', y_prob_rf_clf,   C_BLUE),
        ('XGBoost Classifier',       y_prob_xgb_clf,  C_PURPLE),
        ('RF Regressor → RUL',       score_rf_reg,    C_RED),
        ('LSTM → RUL',               score_lstm,      C_AMBER),
    ]

    fig, ax = plt.subplots(figsize=(7, 6))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)

    for name, scores, color in curves:
        fpr, tpr, _ = roc_curve(y_test_clf, scores)
        auc_val     = roc_auc_score(y_test_clf, scores)
        ax.plot(fpr, tpr, color=color, lw=2.2,
                label=f'{name}  (AUC = {auc_val:.4f})')
        ax.fill_between(fpr, tpr, alpha=0.05, color=color)

    ax.plot([0, 1], [0, 1], '--', color=C_GRAY, lw=1.2, label='Aléatoire  (AUC = 0.5000)')
    ax.set_xlabel('Taux de Faux Positifs', fontsize=11)
    ax.set_ylabel('Taux de Vrais Positifs', fontsize=11)
    ax.set_title('Courbe ROC — Comparaison 4 modèles', fontsize=12,
                 fontweight='bold', pad=12)
    ax.legend(fontsize=9, loc='lower right')
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'roc_curve_4models.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ roc_curve_4models.png sauvegardée")


def _plot_learning_curve(model, X, y):
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y, cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
        scoring='f1', train_sizes=np.linspace(0.1, 1.0, 10), n_jobs=-1
    )
    train_mean = train_scores.mean(axis=1)
    train_std  = train_scores.std(axis=1)
    val_mean   = val_scores.mean(axis=1)
    val_std    = val_scores.std(axis=1)

    fig, ax = plt.subplots(figsize=(7, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    ax.plot(train_sizes, train_mean, color=C_BLUE,  lw=2, label='Entraînement')
    ax.plot(train_sizes, val_mean,   color=C_RED,   lw=2, label='Validation (CV)')
    ax.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.12, color=C_BLUE)
    ax.fill_between(train_sizes, val_mean   - val_std,   val_mean   + val_std,   alpha=0.12, color=C_RED)
    ax.set_xlabel('Taille du jeu d\'entraînement', fontsize=11)
    ax.set_ylabel('F1 Score', fontsize=11)
    ax.set_title('Courbes d\'apprentissage — Random Forest', fontsize=12, fontweight='bold', pad=12)
    ax.legend(fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'learning_curve.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ learning_curve.png sauvegardée")


def _plot_rul_pred(y_test, y_pred):
    sample = np.random.choice(len(y_test), size=min(300, len(y_test)), replace=False)
    y_s = np.array(y_test)[sample]
    y_p = np.array(y_pred)[sample]
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    ax.scatter(y_s, y_p, alpha=0.4, color=C_BLUE, s=18, edgecolors='none')
    lims = [min(y_s.min(), y_p.min()), max(y_s.max(), y_p.max())]
    ax.plot(lims, lims, '--', color=C_RED, linewidth=1.5, label='Prédiction parfaite')
    ax.set_xlabel("RUL réel (min)", fontsize=11)
    ax.set_ylabel("RUL prédit (min)", fontsize=11)
    ax.set_title("Prédiction RUL — Random Forest Regressor", fontsize=12, fontweight='bold', pad=12)
    ax.legend(fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'rul_prediction.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ rul_prediction.png sauvegardée")


def _plot_lstm_rul_pred(y_test, y_pred):
    C_PURPLE = '#7C3AED'
    sample = np.random.default_rng(0).choice(len(y_test), size=min(300, len(y_test)), replace=False)
    y_s = y_test[sample]
    y_p = y_pred[sample]
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor(C_LIGHT)
    ax.scatter(y_s, y_p, alpha=0.4, color=C_PURPLE, s=18, edgecolors='none')
    lims = [min(y_s.min(), y_p.min()), max(y_s.max(), y_p.max())]
    ax.plot(lims, lims, '--', color=C_RED, linewidth=1.5, label='Prédiction parfaite')
    ax.set_xlabel("RUL réel (min)", fontsize=11)
    ax.set_ylabel("RUL prédit (min)", fontsize=11)
    ax.set_title("Prédiction RUL — LSTM", fontsize=12, fontweight='bold', pad=12)
    ax.legend(fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_PATH, 'lstm_rul_prediction.png'), dpi=150, bbox_inches='tight')
    plt.close()
    print("→ lstm_rul_prediction.png sauvegardée")


# ─── SAUVEGARDE ──────────────────────────────────────────────────────────────

def save_models(clf, reg, xgb, lstm, lstm_scaler,
                clf_metrics, reg_metrics, xgb_metrics, lstm_metrics):
    os.makedirs(MODEL_PATH, exist_ok=True)
    with open(os.path.join(MODEL_PATH, 'mecha_classifier.pkl'), 'wb') as f:
        pickle.dump(clf, f)
    with open(os.path.join(MODEL_PATH, 'mecha_regressor.pkl'), 'wb') as f:
        pickle.dump(reg, f)
    with open(os.path.join(MODEL_PATH, 'mecha_xgb_classifier.pkl'), 'wb') as f:
        pickle.dump(xgb, f)
    lstm.save(os.path.join(MODEL_PATH, 'mecha_lstm_regressor.keras'))
    with open(os.path.join(MODEL_PATH, 'mecha_lstm_scaler.pkl'), 'wb') as f:
        pickle.dump(lstm_scaler, f)

    all_metrics = {
        'classification':     clf_metrics,
        'xgb_classification': xgb_metrics,
        'regression':         reg_metrics,
        'lstm_regression':    lstm_metrics,
    }
    with open(os.path.join(MODEL_PATH, 'metrics.json'), 'w') as f:
        json.dump(all_metrics, f, indent=2)

    print(f"\nModèles sauvegardés dans {MODEL_PATH}/")
    print(json.dumps(all_metrics, indent=2))


# ─── DEMO MINI-BATCH ─────────────────────────────────────────────────────────

def demo_minibatch(X, y, chunk_size=500):
    """
    Entraînement online par mini-lots avec SGDClassifier.partial_fit().
    Démontre la capacité d'apprentissage incrémental (flux de données continu).
    """
    print("\n======= DEMO : Entraînement mini-batch (online) =======")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    weights = compute_class_weight('balanced', classes=np.array([0, 1]), y=y_train)
    class_weight_dict = {0: weights[0], 1: weights[1]}

    sgd = SGDClassifier(loss='log_loss', class_weight=class_weight_dict, random_state=42, max_iter=1)
    n_chunks = 0
    for i in range(0, len(X_train_s), chunk_size):
        X_chunk = X_train_s[i:i + chunk_size]
        y_chunk = y_train.iloc[i:i + chunk_size]
        sgd.partial_fit(X_chunk, y_chunk, classes=[0, 1])
        n_chunks += 1

    f1  = f1_score(y_test, sgd.predict(X_test_s))
    acc = accuracy_score(y_test, sgd.predict(X_test_s))
    print(f"Mini-lots traités : {n_chunks}  |  Taille lot : {chunk_size} obs.")
    print(f"F1 : {f1:.4f}  |  Accuracy : {acc:.4f}  (vs Random Forest pour comparaison)")
    print("→ Adapté aux flux temps réel (capteurs IoT industriels)")


# ─── MAIN ─────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import os as _os
    _os.environ.setdefault('TF_ENABLE_ONEDNN_OPTS', '0')
    _os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')

    df_full = pd.read_csv(DATA_PATH)
    X, y_clf, y_reg = load_data()

    clf, clf_metrics, X_test, y_test, y_pred, y_prob_rf = train_classifier(X, y_clf)
    xgb, xgb_metrics, y_prob_xgb = train_xgb_classifier(X, y_clf)
    reg, reg_metrics = train_regressor(X, y_reg)
    lstm, lstm_scaler, lstm_metrics = train_lstm_regressor(df_full)

    _plot_roc_comparison(y_test, y_prob_rf, clf_metrics['auc_roc'],
                         y_prob_xgb, xgb_metrics['auc_roc'])

    y_prob_xgb_test = xgb.predict_proba(X_test)[:, 1]
    _plot_roc_4models(X_test, y_test, y_prob_rf, y_prob_xgb_test, reg, lstm, lstm_scaler)

    demo_minibatch(X, y_clf)

    save_models(clf, reg, xgb, lstm, lstm_scaler,
                clf_metrics, reg_metrics, xgb_metrics, lstm_metrics)
    print("\nEntraînement terminé avec succès.")
