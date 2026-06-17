# MECHA — Solution IA de Maintenance Prédictive

Projet MSPR TPRE841 — Certification RNCP35584 (Bloc 4)

## Présentation

Solution d'intelligence artificielle pour la maintenance prédictive des machines industrielles de l'entreprise **MECHA** (5 usines, France + Espagne). Elle repose sur **4 modèles ML** :

| Modèle | Type | Métrique clé |
|---|---|---|
| RF Classifier | Classification (panne 0/1) | AUC : 0.9718 — F1 : 0.777 |
| XGBoost Classifier | Classification (panne 0/1) | AUC : 0.9729 — F1 : 0.815 |
| RF Regressor | Régression (RUL en minutes) | R² : 0.9935 — MAE : 4.19 min |
| LSTM Regressor | Régression séquentielle (RUL) | R² : 0.9935 — MAE : 4.11 min |

## Architecture

```
Capteurs IoT / MES / SCADA
        ↓
data_preparation.py   ← nettoyage, feature engineering (10 features)
        ↓
model_training.py     ← RF clf, XGBoost clf, RF reg, LSTM reg
        ↓
app.py (Flask API)    ← /predict  /predict/batch  /metrics  /plot
        ↓
Dashboard opérateur   ← tableaux de bord maintenance multi-sites
```

## Démarrage rapide

### Avec Docker (recommandé)

```bash
docker build -t mecha-api .
docker run -p 5000:5000 mecha-api
```

### En local

```bash
pip install -r requirements.txt
python app.py
```

Accès dashboard : [http://localhost:5000](http://localhost:5000)

## Utilisation de l'API

```bash
# Santé
curl http://localhost:5000/health

# Prédiction avec RF (défaut)
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "machine_id": "M001",
    "usine": "FR-Lyon",
    "temp_air_C": 25.0,
    "temp_process_C": 35.0,
    "vitesse_rotation_rpm": 1500,
    "couple_Nm": 42.0,
    "usure_outil_min": 120,
    "type_piece": "M",
    "model": "rf"
  }'

# Prédiction avec XGBoost
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{ ..., "model": "xgb" }'

# Prédiction RUL avec LSTM
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{ ..., "model": "lstm" }'
```

### Réponse

```json
{
  "machine_id": "M001",
  "modele_utilise": "random_forest+random_forest",
  "prediction": {
    "panne_detectee": false,
    "probabilite_panne": 0.03,
    "RUL_min": 145.2,
    "date_panne_estimee": "18/06/2026 à 14:32",
    "niveau_alerte": "NORMAL"
  },
  "recommandation": "Machine en état nominal..."
}
```

## Seuils d'alerte

| Niveau    | Condition                              |
|-----------|----------------------------------------|
| NORMAL    | Prob. panne < 45% ET RUL > 60 min     |
| ATTENTION | Prob. panne ≥ 45% OU RUL < 60 min     |
| CRITIQUE  | Prob. panne ≥ 70% OU RUL < 30 min     |

## Tests

```bash
pytest tests/test_mecha.py -v
```

**21 tests** couvrant les données, les 4 modèles et l'API (100% de réussite).

## Données

| Fichier | Source | Rôle |
|---|---|---|
| `data/ai4i2020.csv` | UCI ML Repository | Base pannes machine (10 000 lignes) |
| `data/smart_manufacturing_dataset.csv` | Kaggle | Features process industriel |
| `data/mecha_capteurs.csv` | Généré | Capteurs IoT contextualisés MECHA |
| `data/mecha_production.csv` | Généré | Données production par usine |
| `data/mecha_ml_dataset.csv` | Pipeline ETL | Dataset final ML (10 000 lignes, 10 features) |

## Structure du projet

```
mecha_clean/
├── app.py                          # API REST Flask (point d'entrée)
├── requirements.txt
├── Dockerfile
├── src/
│   ├── app.py                      # Alias pour compatibilité pytest
│   ├── data_preparation.py
│   └── model_training.py
├── models/
│   ├── mecha_classifier.pkl        # RF Classifier (3.5 Mo)
│   ├── mecha_regressor.pkl         # RF Regressor (48 Mo)
│   ├── mecha_xgb_classifier.pkl    # XGBoost Classifier
│   ├── mecha_lstm_regressor.keras  # LSTM Regressor
│   ├── mecha_lstm_scaler.pkl       # Scaler LSTM
│   └── metrics.json                # Métriques des 4 modèles
├── data/
├── tests/
│   └── test_mecha.py               # 21 tests pytest
├── templates/
│   └── dashboard_mecha.html
├── static/
│   ├── dashboard.js
│   └── dashboard.css
├── docs/
│   ├── *.png                       # Graphiques ML (ROC, confusion, RUL...)
│   └── MECHA_Livrables_MSPR_TPRE841_COMPLET.docx
└── .github/workflows/ci.yml        # CI/CD GitHub Actions
```

## Équipe

Projet réalisé dans le cadre de la MSPR TPRE841 — EPSI 2025-2026.

| Membre | Rôle |
|---|---|
| MBAYE Madjiguene | — |
| FALL Modou | — |
| TRABELSI Kaouther | — |
| EL MOUKADEM Imane | — |
