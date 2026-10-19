/*
  Données de la galerie.

  Pour ajouter une photo :
    1. copier le fichier dans  public/images/gallery/
    2. ajouter un objet à la liste ci-dessous (width et height sont facultatifs mais
       évitent que la page « saute » pendant le chargement).

  Les catégories sont libres : le filtre se construit tout seul à partir de ce que vous écrivez.
  L’ordre de la liste est l’ordre d’affichage.
*/

export type GalleryItem = {
    file: string;       // nom du fichier dans public/images/gallery/
    title: string;      // légende affichée sur la photo et dans l’agrandissement
    category: string;   // sert au filtre (ex. « Terrain », « Électronique »)
    alt?: string;       // description pour les lecteurs d’écran (par défaut : le titre)
    width?: number;
    height?: number;
};

export const galleryItems: GalleryItem[] = [
    { file: 'osmoseur-chd-zou.jpg', title: 'Unité de traitement d’eau du CHD-Zou', category: 'Terrain', alt: 'Osmoseur et cuves de traitement d’eau de l’unité de dialyse du CHD-Zou', width: 1600, height: 1200 },
    { file: 'mesure-tds.jpg', title: 'Mesure du TDS de l’eau', category: 'Terrain', alt: 'Mesure de la conductivité de l’eau avec un testeur TDS', width: 1200, height: 1600 },
    { file: 'prototype-electronique.jpg', title: 'Prototype électronique sur platine d’essai', category: 'Électronique', alt: 'Montage sur platine d’essai avec afficheur LCD, LED et application mobile', width: 1200, height: 1600 },
    { file: 'mor-eyes-banc-de-test.jpg', title: 'Banc de test MOR-EYES', category: 'Électronique', alt: 'Maquette de test du système MOR-EYES avec servomoteurs', width: 1080, height: 785 },
    { file: 'mor-eyes-servomoteurs.jpg', title: 'Servomoteurs du banc de test', category: 'Électronique', alt: 'Gros plan sur les servomoteurs du banc de test MOR-EYES', width: 1080, height: 1331 },
    { file: 'mor-eyes-prototype.jpg', title: 'MOR-EYES devant son interface', category: 'Logiciel', alt: 'Prototype MOR-EYES devant l’interface du logiciel de communication', width: 1080, height: 789 },
    { file: 'ppg-signal-brut.jpg', title: 'Signal PPG issu de la vidéo du visage', category: 'Logiciel', alt: 'Capture de l’expérimentation PPG : zone du visage analysée et signal brut', width: 1600, height: 900 },
    { file: 'dicom-coupe-ct.jpg', title: 'DICOM Anonymizer : coupe CT anonymisée', category: 'Logiciel', alt: 'Coupe de scanner CT affichée après anonymisation par DICOM Anonymizer', width: 640, height: 477 },
    { file: 'dicom-verification-serie.jpg', title: 'DICOM Anonymizer : vérification de la série', category: 'Logiciel', alt: 'Résultat de la vérification d’une série DICOM anonymisée', width: 940, height: 380 },
    { file: 'fusion-manometre.jpg', title: 'Manomètre modélisé sous Fusion', category: 'Modélisation 3D', alt: 'Modèle 3D d’un manomètre sur raccord, réalisé sous Autodesk Fusion', width: 1600, height: 859 },
    { file: 'dht11-lcd.jpg', title: 'Station température et humidité (DHT11)', category: 'Électronique', alt: 'Montage Arduino avec capteur DHT11 et afficheur LCD indiquant humidité et température', width: 1600, height: 1200 },
    { file: 'dht11-code-arduino.jpg', title: 'Programmation du capteur DHT11 sous Arduino IDE', category: 'Électronique', alt: 'Montage DHT11 et LCD devant le code Arduino IDE', width: 1600, height: 1200 },
    { file: 'fusion-pose-reservoir.jpg', title: 'Support de pose du réservoir (Fusion)', category: 'Modélisation 3D', alt: 'Modèle 3D d’une plateforme avec échelle et garde-corps pour pose de réservoir', width: 1600, height: 900 },
    { file: 'ultrason-lcd.jpg', title: 'Mesure de distance par ultrason', category: 'Électronique', alt: 'Montage Arduino avec capteur à ultrasons et LCD affichant temps et distance', width: 1200, height: 1600 },
    { file: 'radar-ultrason.jpg', title: 'Radar à ultrasons sur servomoteur', category: 'Électronique', alt: 'Capteur ultrasons monté sur servomoteur avec affichage angle et distance et radar sur l’écran', width: 1600, height: 1200 },
    { file: 'fusion-bras.jpg', title: 'Pièce « bras » modélisée sous Fusion', category: 'Modélisation 3D', alt: 'Modèle 3D d’une embase cylindrique avec nervures, sous Fusion', width: 1600, height: 858 },
    { file: 'detection-main-mediapipe.jpg', title: 'Détection de la main avec OpenCV et MediaPipe', category: 'Logiciel', alt: 'Suivi des points de la main en temps réel avec Python, OpenCV et MediaPipe dans Spyder', width: 1600, height: 858 },
    { file: 'matlab-emg.jpg', title: 'Filtrage et spectre d’un signal EMG (MATLAB)', category: 'Logiciel', alt: 'Signal EMG filtré en passe-bande et spectres en fréquence sous MATLAB', width: 1600, height: 859 },
    { file: 'mor-eyes-pro-banc.jpg', title: 'MOR-EYES PRO : interface et maquette', category: 'Électronique', alt: 'Interface MOR-EYES PRO devant la maquette avec servomoteurs', width: 1600, height: 1205 },
    { file: 'kicad-carte-esp32.jpg', title: 'Carte ESP32 conçue sous KiCad', category: 'Électronique', alt: 'Schéma, placement des composants et vue 3D d’une carte à base d’ESP32 dans KiCad', width: 1600, height: 900 },
    { file: 'blender-phare.jpg', title: 'Phare modélisé sous Blender', category: 'Modélisation 3D', alt: 'Rendu Blender d’un phare à rayures rouges et blanches', width: 1600, height: 900 },
    { file: 'medora-solidworks.jpg', title: 'MEDORA : assistant médical vocal (SolidWorks)', category: 'Modélisation 3D', alt: 'Modèle 3D du boîtier de l’assistant médical vocal MEDORA avec écran, haut-parleur et micro', width: 1404, height: 735 },
    { file: 'bras-servomoteurs.jpg', title: 'Bras articulé à servomoteurs', category: 'Électronique', alt: 'Maquette de bras articulé réalisée avec deux servomoteurs commandés par Arduino', width: 1205, height: 1600 },
];
