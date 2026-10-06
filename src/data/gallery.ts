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
];
