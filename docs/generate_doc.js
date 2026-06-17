const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents
} = require('docx');
const fs = require('fs');

const BLUE = '1D9E75';
const DARK = '2C2C2A';
const GRAY = 'F1EFE8';
const AMBER = 'BA7517';
const RED = 'D85A30';
const WHITE = 'FFFFFF';

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE } },
    children: [new TextRun({ text, font: 'Arial', size: 36, bold: true, color: DARK })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: '0F6E56' })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: DARK })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 140 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: DARK, ...opts })]
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: DARK, bold })]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function space() {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun('')] });
}

function infoBox(label, value, color = BLUE) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [2500, 6526],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 2500, type: WidthType.DXA },
            shading: { fill: color, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 20, bold: true, color: WHITE })] })]
          }),
          new TableCell({
            borders,
            width: { size: 6526, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: value, font: 'Arial', size: 20, color: DARK })] })]
          })
        ]
      })
    ]
  });
}

function metricTable(rows) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [3500, 2763, 2763],
    rows: [
      new TableRow({
        children: ['Métrique', 'Random Forest', 'Modèle de comparaison'].map((h, i) =>
          new TableCell({
            borders,
            width: { size: i === 0 ? 3500 : 2763, type: WidthType.DXA },
            shading: { fill: BLUE, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, font: 'Arial', size: 20, bold: true, color: WHITE })] })]
          })
        )
      }),
      ...rows.map(([a, b, c], idx) =>
        new TableRow({
          children: [a, b, c].map((val, i) =>
            new TableCell({
              borders,
              width: { size: i === 0 ? 3500 : 2763, type: WidthType.DXA },
              shading: { fill: idx % 2 === 0 ? 'F7F7F5' : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ alignment: i > 0 ? AlignmentType.CENTER : AlignmentType.LEFT, children: [new TextRun({ text: val, font: 'Arial', size: 20, color: DARK })] })]
            })
          )
        })
      )
    ]
  });
}

function simpleTable(headers, rows, colWidths) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) =>
          new TableCell({
            borders,
            width: { size: colWidths[i], type: WidthType.DXA },
            shading: { fill: BLUE, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Arial', size: 20, bold: true, color: WHITE })] })]
          })
        )
      }),
      ...rows.map(([...vals], idx) =>
        new TableRow({
          children: vals.map((val, i) =>
            new TableCell({
              borders,
              width: { size: colWidths[i], type: WidthType.DXA },
              shading: { fill: idx % 2 === 0 ? 'F7F7F5' : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: val, font: 'Arial', size: 20, color: DARK })] })]
            })
          )
        })
      )
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: DARK },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '0F6E56' },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: DARK },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'MECHA — Solution IA de Maintenance Prédictive  |  MSPR TPRE841', font: 'Arial', size: 18, color: '5F5E5A' })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
            spacing: { before: 80 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: '5F5E5A' }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '5F5E5A' }),
              new TextRun({ text: ' / ', font: 'Arial', size: 18, color: '5F5E5A' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: '5F5E5A' }),
            ]
          })
        ]
      })
    },
    children: [

      // ═══════════════════════════════════════════════════════
      // PAGE DE GARDE
      // ═══════════════════════════════════════════════════════
      new Paragraph({ spacing: { before: 1800, after: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'MECHA', font: 'Arial', size: 80, bold: true, color: BLUE })] }),
      new Paragraph({ spacing: { after: 200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Solution IA de Maintenance Prédictive', font: 'Arial', size: 40, color: DARK })] }),
      new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Documentation Technique & Fonctionnelle', font: 'Arial', size: 28, color: '5F5E5A', italics: true })] }),
      new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'MSPR TPRE841 — CERTIFICATION RNCP35584 — Bloc 4', font: 'Arial', size: 22, bold: true, color: DARK })] }),
      new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'EPSI — Année 2025-2026', font: 'Arial', size: 22, color: '5F5E5A' })] }),
      space(), space(),

      // ═══════════════════════════════════════════════════════
      // FICHE PROJET
      // ═══════════════════════════════════════════════════════
      infoBox('Client', 'MECHA — Entreprise industrielle fictive (5 usines, FR + ES)'),
      space(),
      infoBox('Objectif', 'Maintenance prédictive par IA : classification pannes + prédiction RUL'),
      space(),
      infoBox('Données', 'AI4I 2020 Predictive Maintenance Dataset + Smart Manufacturing Dataset'),
      space(),
      infoBox('Modèles', 'Random Forest Classifier (AUC 0.9757) + Random Forest Regressor (R² 0.9935)'),
      space(),
      infoBox('Déploiement', 'API Flask conteneurisée (Docker) + CI/CD GitHub Actions'),
      space(),
      infoBox('Tests', '16 tests unitaires et d\'intégration — 100% passés'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // TABLE DES MATIÈRES
      // ═══════════════════════════════════════════════════════
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: 'Table des matières', font: 'Arial', size: 32, bold: true, color: DARK })] }),
      new TableOfContents('Table des matières', { hyperlink: true, headingStyleRange: '1-3' }),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // I. CONTEXTE
      // ═══════════════════════════════════════════════════════
      h1('I. Contexte et enjeux'),
      p('MECHA est une entreprise industrielle spécialisée dans la fabrication discrète de pièces mécaniques de haute précision, principalement destinées aux secteurs aéronautique et automobile. Fondée il y a une trentaine d\'années, elle opère sur cinq sites de production répartis entre la France et l\'Espagne.'),
      space(),
      h2('1.1 Présentation de l\'entreprise'),
      bullet('3 sites en France : Lyon, Toulouse, Nantes'),
      bullet('2 sites en Espagne : Madrid, Barcelone'),
      bullet('Clients : constructeurs automobiles européens, équipementiers, acteurs aéronautiques'),
      bullet('Volumes importants, tolérance aux défauts quasi nulle (enjeux sécurité)'),
      space(),
      h2('1.2 Enjeux stratégiques'),
      bullet('Concurrence internationale accrue sur les coûts'),
      bullet('Exigences qualité et traçabilité croissantes, notamment en aéronautique'),
      bullet('Pression sur la réduction des rebuts et des arrêts non planifiés'),
      bullet('Nécessité d\'exploiter les données IoT pour des décisions plus rapides'),
      space(),
      h2('1.3 Problématique industrielle'),
      p('La transformation digitale de MECHA est encore hétérogène : les cinq usines n\'ont pas le même niveau d\'équipement, les données sont fragmentées et la vision globale de la performance reste difficile à obtenir en temps réel. L\'objectif de ce projet est de mettre en place une solution IA de maintenance prédictive permettant d\'anticiper les pannes machines et d\'optimiser les interventions de maintenance.'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // II. ARCHITECTURE
      // ═══════════════════════════════════════════════════════
      h1('II. Architecture technique de la solution'),
      p('L\'architecture proposée s\'articule en quatre couches fonctionnelles, depuis la collecte des données jusqu\'à la restitution des résultats aux équipes métiers.'),
      space(),
      h2('2.1 Sources de données'),
      bullet('Capteurs IoT embarqués sur les machines (températures, vitesse rotation, couple, usure outil)'),
      bullet('Systèmes SCADA/MES des ateliers (états machines, ordres de fabrication, horodatage)'),
      bullet('Historiques de maintenance (journaux d\'interventions, codes défauts, durées d\'arrêt)'),
      bullet('Données de production (quantités, taux de rebuts, consommation énergétique)'),
      space(),
      h2('2.2 Collecte et centralisation'),
      p('Les données temps réel des capteurs IoT sont collectées via un bus de messages (ex. MQTT) et centralisées dans un data lake. Les données batch (historiques de maintenance) sont chargées périodiquement depuis les MES. Un pipeline de préparation (data_preparation.py) effectue le nettoyage, la normalisation et le feature engineering avant alimentation des modèles.'),
      space(),
      h2('2.3 Couche IA et modélisation'),
      bullet('model_training.py : entraînement des modèles Random Forest (classification + régression)'),
      bullet('mecha_classifier.pkl : modèle de classification binaire (panne / normal)'),
      bullet('mecha_regressor.pkl : modèle de régression RUL (Remaining Useful Life)'),
      bullet('metrics.json : métriques de performance stockées et versionnées'),
      space(),
      h2('2.4 Exposition via API REST'),
      p('L\'API Flask (app.py) expose les modèles via trois endpoints :'),
      simpleTable(
        ['Endpoint', 'Méthode', 'Description'],
        [
          ['/health', 'GET', 'Vérification de l\'état du service'],
          ['/predict', 'POST', 'Prédiction unitaire pour une machine'],
          ['/predict/batch', 'POST', 'Prédiction sur un ensemble de machines'],
          ['/metrics', 'GET', 'Performance des modèles en production'],
        ],
        [3000, 1500, 4526]
      ),
      space(),
      h2('2.5 Déploiement et intégration continue'),
      bullet('Conteneurisation Docker : image reproductible et portable entre environnements'),
      bullet('CI/CD GitHub Actions : tests automatiques + build Docker à chaque push'),
      bullet('Versionnement Git du code source et des configurations'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // III. DONNÉES
      // ═══════════════════════════════════════════════════════
      h1('III. Données et préparation'),
      h2('3.1 Sources utilisées'),
      p('Pour des raisons de confidentialité, aucune donnée réelle de MECHA n\'est utilisée. Le projet s\'appuie sur deux jeux de données publics adaptés au contexte industriel.'),
      space(),
      simpleTable(
        ['Jeu de données', 'Source', 'Lignes', 'Usage'],
        [
          ['AI4I 2020 Predictive Maintenance', 'Kaggle / UCI', '10 000', 'Modèles ML (capteurs + pannes)'],
          ['Smart Manufacturing Dataset', 'Kaggle', '10 000', 'Suivi production, énergie, défauts'],
        ],
        [3200, 2200, 1200, 2426]
      ),
      space(),
      h2('3.2 Dictionnaire de données — Dataset capteurs (mecha_capteurs.csv)'),
      simpleTable(
        ['Colonne', 'Type', 'Unité', 'Description'],
        [
          ['piece_id', 'Entier', '-', 'Identifiant unique de la pièce produite'],
          ['type_piece', 'Catégorie', '-', 'Qualité produit : L (low), M (medium), H (high)'],
          ['usine', 'Catégorie', '-', 'Site de production MECHA (FR-Lyon, ES-Madrid...)'],
          ['temp_air_C', 'Flottant', '°C', 'Température de l\'air ambiant (convertie K→°C)'],
          ['temp_process_C', 'Flottant', '°C', 'Température du processus d\'usinage'],
          ['delta_temp_C', 'Flottant', '°C', 'Écart thermique process/air (feature dérivée)'],
          ['vitesse_rotation_rpm', 'Entier', 'tr/min', 'Vitesse de rotation de l\'outil'],
          ['couple_Nm', 'Flottant', 'N.m', 'Couple exercé sur l\'outil'],
          ['usure_outil_min', 'Entier', 'min', 'Temps cumulé d\'utilisation de l\'outil'],
          ['puissance_W', 'Flottant', 'W', 'Puissance mécanique calculée (dérivée)'],
          ['ratio_couple_vitesse', 'Flottant', '-', 'Ratio couple/vitesse (indicateur charge)'],
          ['panne_machine', 'Binaire', '0/1', 'Variable cible : 1 = panne détectée'],
          ['RUL_min', 'Flottant', 'min', 'Temps restant avant défaillance (simulé)'],
        ],
        [2500, 1400, 1200, 3926]
      ),
      space(),
      h2('3.3 Hypothèses de simulation'),
      bullet('Attribution aléatoire des usines (distribution proportionnelle aux 5 sites MECHA)'),
      bullet('RUL calculé sur base du seuil de remplacement outil (260 min) avec bruit gaussien réaliste (σ=5 min)'),
      bullet('Taux de panne réel du dataset : 3.39% — cohérent avec la réalité industrielle'),
      bullet('Feature engineering : puissance mécanique, ratio charge, écart thermique, type pièce encodé'),
      space(),
      h2('3.4 Limites des données'),
      bullet('Données publiques : ne reflètent pas exactement les spécificités machines de MECHA'),
      bullet('RUL simulé : basé sur l\'usure outil uniquement, sans modélisation physique complète'),
      bullet('Pas de données temporelles continues : impossible de modéliser les séries temporelles réelles'),
      bullet('Biais potentiel : le dataset AI4I est issu d\'une simulation numérique (pas de capteurs réels)'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // IV. MODÈLES IA
      // ═══════════════════════════════════════════════════════
      h1('IV. Modèles d\'intelligence artificielle'),
      h2('4.1 Modèle 1 — Classification (panne / normal)'),
      p('L\'objectif est de détecter, à partir des données capteurs en temps réel, si une machine est en état de panne ou de fonctionnement normal.'),
      space(),
      h3('Algorithme retenu : Random Forest Classifier'),
      p('Le Random Forest a été sélectionné pour sa robustesse aux données déséquilibrées (class_weight=\'balanced\'), sa résistance au sur-apprentissage et son interprétabilité via l\'importance des features. La régression logistique a été étudiée comme modèle de comparaison.'),
      space(),
      h3('Paramètres du modèle'),
      simpleTable(
        ['Paramètre', 'Valeur', 'Justification'],
        [
          ['n_estimators', '200', 'Équilibre performance / temps d\'entraînement'],
          ['max_depth', '12', 'Limite le sur-apprentissage'],
          ['min_samples_split', '5', 'Évite les feuilles trop spécialisées'],
          ['class_weight', 'balanced', 'Compense le déséquilibre classes (3.4% pannes)'],
          ['random_state', '42', 'Reproductibilité des résultats'],
        ],
        [2500, 1800, 4726]
      ),
      space(),
      h3('Résultats de performance — Classification'),
      metricTable([
        ['Accuracy', '98.85%', '85.90% (Logistic Reg.)'],
        ['F1-Score (pannes)', '0.8099', '0.2950'],
        ['AUC-ROC', '0.9757', 'N/A'],
        ['CV F1 (5-fold)', '0.8085 ± 0.0325', '-'],
        ['Précision (pannes)', '92%', '-'],
        ['Rappel (pannes)', '72%', '-'],
      ]),
      space(),
      p('Le Random Forest surpasse largement la régression logistique sur la classe minoritaire (pannes), ce qui confirme la pertinence du choix algorithmique pour ce type de données industrielles déséquilibrées.'),
      space(),
      h2('4.2 Modèle 2 — Régression RUL (Remaining Useful Life)'),
      p('L\'objectif est de prédire le temps restant (en minutes) avant qu\'une machine n\'entre en défaillance, permettant de planifier les interventions de maintenance au bon moment.'),
      space(),
      h3('Algorithme retenu : Random Forest Regressor'),
      space(),
      h3('Résultats de performance — Régression RUL'),
      metricTable([
        ['MAE (min)', '4.19 min', '4.00 min (Régression linéaire)'],
        ['RMSE (min)', '5.29 min', '-'],
        ['R²', '0.9935', '0.9941'],
      ]),
      space(),
      p('Les deux modèles obtiennent des performances proches sur la régression RUL. Le Random Forest est retenu car il est plus robuste aux outliers et plus cohérent avec l\'approche globale du projet (même famille algorithmique, même pipeline de déploiement).'),
      space(),
      h2('4.3 Features les plus importantes'),
      bullet('usure_outil_min : première feature (corrélation directe avec la dégradation)'),
      bullet('puissance_W : indicateur global de la charge machine'),
      bullet('couple_Nm : fort signal de stress mécanique'),
      bullet('delta_temp_C : écart thermique révélateur de comportements anormaux'),
      bullet('vitesse_rotation_rpm : paramètre process central'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // V. SOLUTION APPLICATIVE
      // ═══════════════════════════════════════════════════════
      h1('V. Solution applicative et intégration'),
      h2('5.1 Architecture applicative'),
      p('Les résultats des modèles IA sont exposés via une API REST Flask, interrogée par un tableau de bord opérateur destiné aux équipes maintenance et production.'),
      space(),
      h2('5.2 Seuils d\'alerte et règles métiers'),
      simpleTable(
        ['Niveau', 'Condition déclenchante', 'Action recommandée'],
        [
          ['NORMAL', 'Prob. panne < 45% ET RUL > 60 min', 'Maintenance selon calendrier préventif'],
          ['ATTENTION', 'Prob. panne ≥ 45% OU RUL < 60 min', 'Planifier intervention dans la semaine'],
          ['CRITIQUE', 'Prob. panne ≥ 70% OU RUL < 30 min', 'Arrêt machine, intervention immédiate'],
        ],
        [1800, 4026, 3200]
      ),
      space(),
      h2('5.3 Fréquence de mise à jour'),
      bullet('Prédictions temps réel : toutes les 5 minutes par machine active'),
      bullet('Réentraînement des modèles : mensuel (ou à la détection d\'une dérive de performance)'),
      bullet('Tableau de bord : rafraîchissement toutes les 60 secondes'),
      space(),
      h2('5.4 Endpoints API — Exemples'),
      p('Requête de prédiction unitaire (POST /predict) :'),
      new Paragraph({
        spacing: { after: 80 },
        shading: { fill: '2C2C2A', type: ShadingType.CLEAR },
        children: [new TextRun({ text: '{ "machine_id": "M001", "usine": "FR-Lyon", "temp_air_C": 25.0, "temp_process_C": 35.0, "vitesse_rotation_rpm": 1500, "couple_Nm": 42.0, "usure_outil_min": 120, "type_piece": "M" }', font: 'Courier New', size: 18, color: WHITE })]
      }),
      space(),
      p('Réponse de l\'API :'),
      new Paragraph({
        spacing: { after: 200 },
        shading: { fill: '2C2C2A', type: ShadingType.CLEAR },
        children: [new TextRun({ text: '{ "prediction": { "panne_detectee": false, "probabilite_panne": 0.03, "RUL_min": 145.2, "niveau_alerte": "NORMAL" }, "recommandation": "Machine en état nominal. Prochaine révision selon calendrier préventif." }', font: 'Courier New', size: 18, color: WHITE })]
      }),
      space(),
      h2('5.5 Interfaces utilisateur'),
      bullet('Tableau de bord global : vue synthétique de l\'état de toutes les machines par usine'),
      bullet('Carte de chaleur des risques : couleur par machine selon niveau d\'alerte (vert / orange / rouge)'),
      bullet('Fiche machine détaillée : historique RUL, courbe de dégradation, dernières interventions'),
      bullet('Panneau d\'alertes : liste des machines en état CRITIQUE ou ATTENTION avec horodatage'),
      bullet('Rapport automatique : export PDF hebdomadaire pour la Direction industrielle'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // VI. VALIDATION
      // ═══════════════════════════════════════════════════════
      h1('VI. Validation de la solution'),
      h2('6.1 Stratégie de validation'),
      p('La validation s\'appuie sur deux axes complémentaires : une validation technique (métriques ML) et une validation fonctionnelle (conformité aux besoins métiers de MECHA).'),
      space(),
      h2('6.2 Validation technique'),
      bullet('Séparation train / test : 80% / 20% avec stratification sur la classe panne'),
      bullet('Cross-validation 5-fold sur le classificateur : F1 = 0.8085 ± 0.0325 (variance faible = stable)'),
      bullet('AUC-ROC = 0.9757 : excellente capacité de discrimination panne/normal'),
      bullet('R² = 0.9935 : le modèle RUL explique 99.35% de la variance'),
      bullet('MAE = 4.19 min : erreur moyenne inférieure à 5 minutes sur le RUL (acceptable industriellement)'),
      space(),
      h2('6.3 Tests automatisés'),
      p('16 tests pytest couvrent trois niveaux :'),
      bullet('Tests données (4) : existence, forme, absence de valeurs manquantes, cohérence du taux de panne'),
      bullet('Tests modèles (6) : existence des fichiers, seuils de performance, forme des sorties, valeurs cohérentes'),
      bullet('Tests API (6) : endpoints /health, /predict, /predict/batch, /metrics, gestion des erreurs'),
      space(),
      h2('6.4 Critères d\'acceptation métier'),
      simpleTable(
        ['Critère', 'Seuil minimum', 'Résultat obtenu', 'Statut'],
        [
          ['AUC-ROC classification', '≥ 0.85', '0.9757', 'OK'],
          ['F1-Score pannes (CV)', '≥ 0.70', '0.8085', 'OK'],
          ['MAE RUL', '≤ 15 min', '4.19 min', 'OK'],
          ['Temps de réponse API', '< 500 ms', '< 100 ms', 'OK'],
          ['Taux de couverture tests', '≥ 80%', '100% (16/16)', 'OK'],
        ],
        [3000, 2000, 2000, 2026]
      ),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // VII. DÉPLOIEMENT
      // ═══════════════════════════════════════════════════════
      h1('VII. Déploiement et mise en oeuvre'),
      h2('7.1 Stratégie de déploiement'),
      p('Le déploiement est envisagé de manière progressive sur les 5 usines de MECHA, en commençant par le site pilote de FR-Lyon (le mieux équipé en capteurs IoT).'),
      space(),
      simpleTable(
        ['Phase', 'Périmètre', 'Durée estimée'],
        [
          ['Phase 1 — Pilote', 'FR-Lyon (1 ligne de production)', '4 semaines'],
          ['Phase 2 — Extension France', 'FR-Toulouse + FR-Nantes', '6 semaines'],
          ['Phase 3 — Espagne', 'ES-Madrid + ES-Barcelone', '6 semaines'],
          ['Phase 4 — Industrialisation', 'Toutes usines + optimisation', 'Continu'],
        ],
        [2500, 4000, 2526]
      ),
      space(),
      h2('7.2 Prérequis techniques'),
      bullet('Chaque usine doit disposer d\'un réseau IP permettant la remontée des données capteurs'),
      bullet('Serveur d\'hébergement : minimum 4 vCPU, 8 Go RAM, 50 Go stockage par site'),
      bullet('Docker Engine installé sur le serveur de déploiement'),
      bullet('Accès réseau vers le repository Git pour les mises à jour'),
      bullet('Synchronisation NTP entre tous les équipements (cohérence temporelle des données)'),
      space(),
      h2('7.3 Points de vigilance'),
      bullet('Qualité des données : les capteurs vieillissants peuvent dériver — nécessité d\'une supervision continue de la qualité'),
      bullet('Latence réseau : les usines Espagne ont une connectivité moins stable — prévoir un mode dégradé local'),
      bullet('Réentraînement : les modèles doivent être réentraînés lorsque les performances chutent (dérive de distribution)'),
      bullet('Conduite du changement : les équipes maintenance doivent être formées à l\'interprétation des prédictions'),
      space(),
      h2('7.4 Intégration continue (CI/CD)'),
      p('Le pipeline GitHub Actions assure :'),
      bullet('Déclenchement automatique à chaque push sur les branches main et develop'),
      bullet('Étape 1 : préparation des données + entraînement des modèles'),
      bullet('Étape 2 : exécution de la suite de tests pytest (16 tests)'),
      bullet('Étape 3 : build de l\'image Docker et health check de l\'API'),
      bullet('Mise à disposition des artefacts (métriques, graphiques) en fin de pipeline'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // VIII. RGPD
      // ═══════════════════════════════════════════════════════
      h1('VIII. Enjeux RGPD'),
      p('Ce projet utilise des données publiques et simulées, sans données personnelles réelles. Les considérations RGPD suivantes s\'appliqueraient dans un contexte de déploiement réel.'),
      space(),
      simpleTable(
        ['Type de données', 'Qualification', 'Mesure requise'],
        [
          ['Données capteurs machines', 'Non personnelles (données industrielles)', 'Pas d\'anonymisation requise'],
          ['Données opérateurs', 'Données personnelles si horodatées', 'Pseudonymisation des identifiants'],
          ['Journaux d\'interventions', 'Données professionnelles', 'Rétention limitée (ex. 5 ans)'],
          ['Alertes nominatives', 'Données personnelles', 'Minimisation, accès restreint au RH'],
        ],
        [2800, 3000, 3226]
      ),
      space(),
      bullet('Rôle DPO : informer le DPO de MECHA de tout traitement de données d\'employés'),
      bullet('Registre des traitements : documenter les flux de données IA dans le registre CNIL'),
      bullet('Durée de conservation : définir une politique de rétention pour les logs API et les prédictions'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // IX. GUIDE UTILISATEUR MÉTIER
      // ═══════════════════════════════════════════════════════
      h1('IX. Guide utilisateur métier'),
      new Paragraph({ spacing: { after: 200 },
        shading: { fill: 'E1F5EE', type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: BLUE } },
        children: [new TextRun({ text: '  Ce guide est destiné aux responsables maintenance et production. Il explique comment interpréter les résultats de la solution IA MECHA sans connaissance technique en intelligence artificielle.', font: 'Arial', size: 22, italics: true, color: DARK })]
      }),
      space(),
      h2('Que fait la solution ?'),
      p('La solution analyse en continu les données de vos machines (température, vitesse, usure de l\'outil) et vous indique, pour chaque machine :'),
      bullet('Si elle risque de tomber en panne dans les prochaines heures'),
      bullet('Combien de temps de fonctionnement il lui reste avant d\'atteindre le seuil de maintenance'),
      space(),
      h2('Comment lire le tableau de bord ?'),
      simpleTable(
        ['Couleur / Icône', 'Signification', 'Action à mener'],
        [
          ['Vert — NORMAL', 'Machine en bon état', 'Aucune action urgente — suivre le plan préventif'],
          ['Orange — ATTENTION', 'Dégradation détectée', 'Planifier une inspection dans les 48h'],
          ['Rouge — CRITIQUE', 'Panne imminente', 'Arrêter la machine et intervenir immédiatement'],
        ],
        [2500, 3000, 3526]
      ),
      space(),
      h2('Comment interpréter le RUL ?'),
      p('Le RUL (Remaining Useful Life) est exprimé en minutes de fonctionnement. Par exemple, un RUL de 145 minutes signifie que la machine peut encore fonctionner environ 2h25 avant d\'atteindre le seuil de maintenance. Cette valeur est une estimation — une marge de ±5 minutes est normale.'),
      space(),
      h2('Limites à connaître'),
      bullet('Le modèle ne remplace pas l\'expertise du technicien : il guide, il ne décide pas'),
      bullet('Les prédictions sont basées sur les données historiques — une situation inédite peut surprendre le modèle'),
      bullet('En cas de doute, toujours faire confiance à l\'observation terrain en plus de la prédiction'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // X. CONDUITE DU CHANGEMENT
      // ═══════════════════════════════════════════════════════
      h1('X. Conduite du changement'),
      h2('10.1 Acteurs concernés'),
      simpleTable(
        ['Acteur', 'Rôle', 'Message clé'],
        [
          ['Direction générale', 'Sponsor du projet', 'ROI attendu : réduction des arrêts non planifiés'],
          ['Direction industrielle', 'Maître d\'ouvrage', 'Pilotage des 5 sites avec une vision unifiée'],
          ['Direction qualité', 'Utilisateur des alertes', 'Meilleure traçabilité, réduction des rebuts'],
          ['Responsables maintenance', 'Utilisateurs principaux', 'Outil d\'aide à la décision, pas de remplacement'],
          ['Opérateurs machines', 'Fournisseurs de données', 'Les capteurs travaillent pour eux'],
          ['DSI', 'Intégration technique', 'Architecture cohérente avec le SI existant'],
        ],
        [2500, 2500, 4026]
      ),
      space(),
      h2('10.2 Plan de formation'),
      bullet('Session 1 (Direction) : présentation des enjeux IA, démonstration du tableau de bord — 2h'),
      bullet('Session 2 (Responsables maintenance) : utilisation du tableau de bord, interprétation des alertes — 4h'),
      bullet('Session 3 (DSI) : architecture technique, API, CI/CD, procédures de maintenance — 1 journée'),
      bullet('Documentation : guide utilisateur, FAQ, procédures d\'escalade disponibles sur l\'intranet'),
      space(),
      h2('10.3 Déploiement progressif'),
      bullet('Phase pilote FR-Lyon avec un groupe d\'utilisateurs volontaires (early adopters)'),
      bullet('Collecte des retours hebdomadaires, ajustements des seuils d\'alerte si nécessaire'),
      bullet('Communication régulière sur les résultats obtenus (pannes évitées, économies réalisées)'),
      bullet('Extension progressive aux autres sites après validation du pilote'),
      space(),
      h2('10.4 Indicateurs de succès'),
      bullet('Taux d\'adoption : % d\'équipes utilisant activement le tableau de bord après 3 mois'),
      bullet('Réduction des pannes non planifiées : objectif -20% sur le site pilote'),
      bullet('Satisfaction utilisateur : enquête trimestrielle auprès des responsables maintenance'),
      bullet('Performance modèle en production : AUC-ROC maintenu > 0.85 (monitoring continu)'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // XI. COMPTE-RENDU ÉCHANGES CLIENT
      // ═══════════════════════════════════════════════════════
      h1('XI. Compte-rendu des échanges avec le client'),
      h2('Guide d\'entretien simulé'),
      simpleTable(
        ['Question posée', 'Réponse / Décision'],
        [
          ['Quels types de pannes sont prioritaires ?', 'Défauts d\'usure outil et chaleur — les plus fréquents et les plus coûteux'],
          ['Quelle précision minimum pour être utile ?', 'MAE RUL ≤ 15 min, AUC ≥ 0.85 — en dessous, pas d\'intérêt opérationnel'],
          ['Les opérateurs accepteront-ils l\'outil ?', 'Oui si l\'interface est simple et les alertes pertinentes — former avant déploiement'],
          ['Fréquence de mise à jour des prédictions ?', 'Toutes les 5 minutes par machine — acceptable pour le contexte industriel'],
          ['Contraintes d\'infrastructure ?', 'Docker obligatoire, pas de cloud public autorisé (données industrielles sensibles)'],
          ['Intégration avec le MES existant ?', 'Via API REST — l\'équipe DSI validera les formats d\'échange en phase 2'],
        ],
        [4500, 4526]
      ),
      space(),
      h2('Synthèse des besoins collectés'),
      bullet('Besoin prioritaire : détecter les pannes avant qu\'elles surviennent (maintenance prédictive vs corrective)'),
      bullet('Interface simple : les responsables maintenance ne sont pas data scientists'),
      bullet('Multi-sites : vision centralisée des 5 usines, avec drill-down par site'),
      bullet('Traçabilité : historique des alertes et des actions prises (auditabilité)'),
      bullet('Performance : réponse API < 500ms pour ne pas bloquer les opérateurs'),
      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // ANNEXES
      // ═══════════════════════════════════════════════════════
      h1('Annexes'),
      h2('A. Structure du repository Git'),
      simpleTable(
        ['Répertoire / Fichier', 'Contenu'],
        [
          ['src/data_preparation.py', 'Pipeline de chargement, nettoyage et feature engineering'],
          ['src/model_training.py', 'Entraînement Random Forest (classification + régression)'],
          ['src/app.py', 'API Flask REST — exposition des modèles'],
          ['models/mecha_classifier.pkl', 'Modèle de classification sérialisé'],
          ['models/mecha_regressor.pkl', 'Modèle de régression sérialisé'],
          ['models/metrics.json', 'Métriques de performance (AUC, F1, MAE, R²)'],
          ['data/mecha_ml_dataset.csv', 'Dataset final pour entraînement ML'],
          ['tests/test_mecha.py', '16 tests unitaires et d\'intégration'],
          ['Dockerfile', 'Configuration de conteneurisation'],
          ['.github/workflows/ci.yml', 'Pipeline CI/CD GitHub Actions'],
          ['README.md', 'Documentation de démarrage rapide'],
        ],
        [4000, 5026]
      ),
      space(),
      h2('B. Métriques complètes des modèles'),
      simpleTable(
        ['Modèle', 'Métrique', 'Valeur', 'Interprétation'],
        [
          ['Classification RF', 'AUC-ROC', '0.9757', 'Excellente séparation panne/normal'],
          ['Classification RF', 'F1-Score (pannes)', '0.8099', 'Bon équilibre précision/rappel'],
          ['Classification RF', 'Accuracy', '98.85%', 'Fiable sur les machines normales'],
          ['Classification RF', 'CV F1 (5-fold)', '0.8085 ± 0.033', 'Modèle stable et généralisable'],
          ['Régression RUL RF', 'MAE', '4.19 min', 'Erreur < 5 min, acceptable'],
          ['Régression RUL RF', 'RMSE', '5.29 min', 'Peu d\'outliers importants'],
          ['Régression RUL RF', 'R²', '0.9935', 'Excellente qualité prédictive'],
        ],
        [2500, 2500, 1800, 2226]
      ),

      space(),
      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'MECHA — Solution IA de Maintenance Prédictive — MSPR TPRE841 — EPSI 2025-2026', font: 'Arial', size: 18, color: '5F5E5A', italics: true })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/mecha_project/docs/MECHA_Documentation_Technique.docx', buffer);
  console.log('Documentation Word générée avec succès.');
});
