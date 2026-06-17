"""
MECHA - Préparation des données industrielles
Dataset source : AI4I 2020 Predictive Maintenance Dataset + Smart Manufacturing Dataset
Auteur : Équipe MSPR TPRE841
"""

import pandas as pd
import numpy as np
import os

RAW_PATH = os.path.join(os.path.dirname(__file__), '..', 'data')
OUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'data')


def load_and_merge():
    """Charge et fusionne les deux jeux de données."""
    # --- Dataset 1 : AI4I 2020 (capteurs machine + pannes) ---
    df1 = pd.read_csv(os.path.join(RAW_PATH, 'ai4i2020.csv'))
    df1.columns = df1.columns.str.strip()

    # Renommage pour vocabulaire MECHA
    df1 = df1.rename(columns={
        'UDI': 'piece_id',
        'Product ID': 'produit_id',
        'Type': 'type_piece',
        'Air temperature [K]': 'temp_air_K',
        'Process temperature [K]': 'temp_process_K',
        'Rotational speed [rpm]': 'vitesse_rotation_rpm',
        'Torque [Nm]': 'couple_Nm',
        'Tool wear [min]': 'usure_outil_min',
        'Machine failure': 'panne_machine',
        'TWF': 'defaut_usure_outil',
        'HDF': 'defaut_chaleur',
        'PWF': 'defaut_puissance',
        'OSF': 'defaut_surcharge',
        'RNF': 'defaut_aleatoire',
    })

    # Ajout colonne usine MECHA (simulation 5 usines)
    np.random.seed(42)
    usines = ['FR-Lyon', 'FR-Toulouse', 'FR-Nantes', 'ES-Madrid', 'ES-Barcelone']
    df1['usine'] = np.random.choice(usines, size=len(df1), p=[0.25, 0.20, 0.20, 0.20, 0.15])

    # Conversion Kelvin → Celsius
    df1['temp_air_C'] = (df1['temp_air_K'] - 273.15).round(2)
    df1['temp_process_C'] = (df1['temp_process_K'] - 273.15).round(2)
    df1['delta_temp_C'] = (df1['temp_process_C'] - df1['temp_air_C']).round(2)

    # Feature engineering
    df1['puissance_W'] = (df1['vitesse_rotation_rpm'] * df1['couple_Nm'] * 2 * np.pi / 60).round(2)
    df1['ratio_couple_vitesse'] = (df1['couple_Nm'] / (df1['vitesse_rotation_rpm'] + 1)).round(4)

    # Nombre de types de défauts simultanés
    defaut_cols = ['defaut_usure_outil', 'defaut_chaleur', 'defaut_puissance', 'defaut_surcharge', 'defaut_aleatoire']
    df1['nb_defauts'] = df1[defaut_cols].sum(axis=1)

    # --- Dataset 2 : Smart Manufacturing (production, énergie, qualité) ---
    df2 = pd.read_csv(os.path.join(RAW_PATH, 'smart_manufacturing_dataset.csv'))
    df2.columns = df2.columns.str.strip()
    df2 = df2.rename(columns={
        'Timestamp': 'horodatage',
        'Machine ID': 'machine_id',
        'Material Category': 'categorie_materiau',
        'Material Name': 'materiau',
        'Quantity Used (kg)': 'quantite_kg',
        'Recycled Material (%)': 'taux_recycle_pct',
        'Energy Consumption (kWh)': 'conso_energie_kWh',
        'Production Output (Units)': 'production_unites',
        'Defect Rate (%)': 'taux_defaut_pct',
    })

    df2['horodatage'] = pd.to_datetime(df2['horodatage'])
    df2['heure'] = df2['horodatage'].dt.hour
    df2['jour_semaine'] = df2['horodatage'].dt.dayofweek  # 0=lundi
    df2['rendement_energie'] = (df2['production_unites'] / (df2['conso_energie_kWh'] + 0.01)).round(4)
    df2['alerte_defaut'] = (df2['taux_defaut_pct'] > df2['taux_defaut_pct'].quantile(0.90)).astype(int)

    return df1, df2


def prepare_ml_dataset(df1):
    """Prépare le dataset pour les modèles ML (classification + régression)."""
    df = df1.copy()

    # --- Classification : panne_machine (0/1) ---
    features_clf = [
        'temp_air_C', 'temp_process_C', 'delta_temp_C',
        'vitesse_rotation_rpm', 'couple_Nm', 'usure_outil_min',
        'puissance_W', 'ratio_couple_vitesse',
    ]

    # Encodage type_piece
    df['type_piece_L'] = (df['type_piece'] == 'L').astype(int)
    df['type_piece_M'] = (df['type_piece'] == 'M').astype(int)
    features_clf += ['type_piece_L', 'type_piece_M']

    # --- Régression : RUL (Remaining Useful Life) simulé ---
    # On simule le RUL en fonction de l'usure outil et des paramètres
    max_wear = 260  # seuil de remplacement outil (minutes)
    df['RUL_min'] = (max_wear - df['usure_outil_min']).clip(lower=0)
    # Ajout de bruit réaliste
    np.random.seed(42)
    noise = np.random.normal(0, 5, len(df))
    df['RUL_min'] = (df['RUL_min'] + noise).clip(lower=0).round(1)

    # Nettoyage : suppression des valeurs manquantes
    df_ml = df[features_clf + ['panne_machine', 'RUL_min', 'usine', 'piece_id']].copy()
    df_ml = df_ml.dropna()

    print(f"Dataset ML : {len(df_ml)} lignes, {len(features_clf)} features")
    print(f"Taux de panne : {df_ml['panne_machine'].mean()*100:.2f}%")
    print(f"RUL moyen : {df_ml['RUL_min'].mean():.1f} min")

    return df_ml, features_clf


def save_datasets(df1, df2, df_ml):
    """Sauvegarde les datasets transformés."""
    df1.to_csv(os.path.join(OUT_PATH, 'mecha_capteurs.csv'), index=False)
    df2.to_csv(os.path.join(OUT_PATH, 'mecha_production.csv'), index=False)
    df_ml.to_csv(os.path.join(OUT_PATH, 'mecha_ml_dataset.csv'), index=False)
    print("Datasets sauvegardés dans /data/")


if __name__ == '__main__':
    df1, df2 = load_and_merge()
    df_ml, features = prepare_ml_dataset(df1)
    save_datasets(df1, df2, df_ml)
    print("\n--- Aperçu dataset capteurs ---")
    print(df1.describe().round(2))
