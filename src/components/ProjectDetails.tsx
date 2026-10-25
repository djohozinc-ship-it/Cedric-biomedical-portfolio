import React, { useEffect, useMemo, useState } from "react";
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faCodeBranch, faImages, faMicrochip, faLaptopCode, faLightbulb, faBullseye, faCogs, faChartLine, faPlay } from '@fortawesome/free-solid-svg-icons';
import PremiumMediaGallery from './PremiumMediaGallery';
import '../assets/styles/ProjectDetails.scss';

type ProjectData = {
    slug: string;
    title: string;
    category: string;
    summary: string;
    description: string;
    context: string;
    problem: string;
    solution: string;
    architecture: string;
    hardware: string[];
    software: string[];
    results: string[];
    role: string;
    technologies: string[];
    features: string[];
    media?: { type: 'image' | 'video'; src: string; alt: string }[];
    youtubeVideoId?: string;
    videos?: { id: string; label: string; title: string }[];
    links?: { label: string; url: string }[];
};

export const projects: ProjectData[] = [
    {
        slug: 'sacruro', title: 'SACRURO', category: 'Génie biomédical · IoT · Gestion de l’eau',
        summary: 'Projet de récupération et de valorisation du concentrat rejeté par les unités de dialyse pour des usages non potables.',
        description: 'Le système exploite un ESP32 comme unité centrale pour coordonner l’acquisition, la logique de contrôle et la communication. L’ADS1115 est utilisé pour améliorer l’acquisition des signaux analogiques, tandis que le MCP23017 étend les entrées/sorties nécessaires aux commandes et aux indicateurs. Les mesures sont traitées par le firmware embarqué, puis les états du système sont transmis par MQTT à l’application mobile React Native. Les pompes et les électrovannes sont commandées selon la logique de fonctionnement définie. Lorsque la connexion MQTT n’est pas disponible, le mode point d’accès de l’ESP32 permet de conserver une commande locale. Le watchdog TLC555 apporte une surveillance matérielle indépendante pour renforcer la continuité du système. L’ensemble relie donc capteurs, électronique, firmware, communication et supervision afin d’obtenir un système de récupération et de distribution contrôlé.',
        context: 'Projet réalisé dans le cadre du génie biomédical et de mon mémoire autour de la réutilisation du concentrat issu de l’osmose inverse d’une unité de dialyse.', problem: 'Comment récupérer, surveiller et distribuer cette eau de manière contrôlée tout en intégrant les contraintes d’un environnement hospitalier ?', solution: 'Conception d’un système combinant électronique embarquée, acquisition de paramètres, commande des actionneurs et supervision mobile. Le prototype intègre également un mode local pour conserver une commande du système lorsque la communication distante n’est pas disponible.', architecture: 'Capteurs → acquisition → ESP32 → logique de contrôle → pompes et électrovannes → supervision mobile', hardware: ['ESP32 DevKit V1 / ESP32-WROOM-32E', 'ADS1115', 'MCP23017', 'Capteurs de mesure', 'Pompes', '6 électrovannes', 'Watchdog TLC555', 'Alimentations 5 V / 3,3 V / 24 V'], software: ['Firmware embarqué C/C++', 'MQTT', 'Application mobile React Native', 'Expo', 'Mode local ESP32 AP'], results: ['Prototype et architecture du système développés', 'Chaîne d’acquisition et de commande étudiée', 'Application mobile de supervision développée', 'Mode local intégré comme solution de continuité', 'Projet orienté vers la réduction du gaspillage d’eau en milieu hospitalier'], role: 'Conception du système, électronique, firmware, logique de contrôle et développement de l’interface mobile.', technologies: ['ESP32', 'C/C++', 'ADS1115', 'MCP23017', 'MQTT', 'React Native', 'Expo', 'KiCad'], features: ['Acquisition de paramètres', 'Commande des pompes et électrovannes', 'Supervision MQTT', 'Mode local ESP32', 'Surveillance par watchdog'], youtubeVideoId: 'P_qlPUA7tLQ'
    },
    {
        slug: 'carte-donnees-biomedicales', title: 'Carte universelle de données biomédicales', category: 'Électronique · Instrumentation biomédicale',
        summary: 'Étude d’une carte électronique modulaire pour l’acquisition et l’intégration de données provenant de différents capteurs.',
        description: 'L’approche consiste à séparer l’acquisition analogique, le traitement embarqué et la communication afin de rendre la carte plus facilement adaptable. Les signaux issus des capteurs sont conditionnés puis dirigés vers l’ADS1115 lorsque leur résolution d’acquisition l’exige. L’ESP32 centralise ensuite les données, applique le traitement nécessaire et prépare leur transmission. Cette organisation modulaire permet d’étudier différents types de capteurs sans remettre en cause toute l’architecture. KiCad est utilisé pour transformer cette architecture fonctionnelle en schéma électronique puis en conception de PCB.',
        context: 'Les prototypes biomédicaux utilisent des capteurs et interfaces variés. L’objectif est d’étudier une base électronique pouvant faciliter leur intégration.', problem: 'Comment créer une architecture d’acquisition suffisamment modulaire pour différents capteurs biomédicaux ?', solution: 'Étude d’une architecture autour de l’ESP32, de l’ADS1115 et de différentes interfaces d’acquisition, avec une attention portée au conditionnement et au traitement embarqué.', architecture: 'Capteurs → conditionnement → ADS1115 → ESP32 → traitement → communication', hardware: ['ESP32', 'ADS1115', 'Interfaces capteurs', 'Composants analogiques et numériques'], software: ['Firmware embarqué', 'Traitement des données'], results: ['Architecture modulaire étudiée', 'Intégration de plusieurs interfaces d’acquisition explorée', 'Conception électronique réalisée avec KiCad'], role: 'Étude de l’architecture, choix des composants et conception électronique du prototype.', technologies: ['ESP32', 'ADS1115', 'ADC', 'KiCad', 'Électronique analogique', 'Électronique numérique'], features: ['Acquisition analogique', 'Interfaces capteurs', 'Traitement embarqué', 'Architecture modulaire']
    },
    {
        slug: 'ppg-computer-vision', title: 'Estimation du rythme cardiaque par PPG et vision par ordinateur', category: 'Expérimentation · Traitement du signal · Santé',
        summary: 'Expérimentation d’une méthode sans contact pour estimer le rythme cardiaque à partir d’une vidéo.',
        description: 'La caméra fournit une séquence vidéo dont certaines variations photométriques peuvent contenir une composante liée au flux sanguin. OpenCV est utilisé pour lire et traiter les images, tandis que MediaPipe facilite la détection et le suivi d’une région stable du visage. Les valeurs de cette région sont ensuite extraites au fil des images afin de construire un signal temporel. Le traitement du signal permet alors d’explorer les variations périodiques et leur relation avec une estimation du rythme cardiaque. L’intérêt du projet est de montrer comment vision par ordinateur, extraction de données et traitement du signal peuvent être combinés dans une chaîne expérimentale de santé.',
        context: 'Projet personnel explorant l’utilisation de variations photométriques observables dans une vidéo pour extraire une information physiologique.', problem: 'Comment extraire et traiter un signal physiologique à partir d’une séquence vidéo ?', solution: 'Mise en place d’une chaîne expérimentale utilisant OpenCV et MediaPipe pour détecter une région du visage, extraire les variations du signal et explorer leur traitement.', architecture: 'Caméra → détection du visage → région d’intérêt → extraction du signal → traitement → estimation', hardware: ['Caméra'], software: ['Python', 'OpenCV', 'MediaPipe', 'Traitement du signal'], results: ['Chaîne de traitement vidéo expérimentée', 'Détection et suivi d’une région du visage', 'Exploration de l’estimation non contact du rythme cardiaque'], role: 'Développement et expérimentation de la chaîne de traitement.', technologies: ['Python', 'OpenCV', 'MediaPipe', 'Traitement du signal'], features: ['Détection du visage', 'Suivi d’une région d’intérêt', 'Extraction du signal vidéo', 'Traitement expérimental']
    },
    {
        slug: 'moyes-pro', title: 'Moyes Pro', category: 'Technologie d’assistance · Électronique · Prototypage',
        summary: 'Projet de dispositif d’assistance développé autour d’un besoin fonctionnel et d’une approche de prototypage électronique.',
        description: 'Le projet part d’un besoin d’assistance qui est traduit en fonctions techniques puis en blocs électroniques. Le microcontrôleur assure la logique centrale : il reçoit les informations provenant des entrées, applique les règles de fonctionnement et pilote les sorties. La programmation embarquée fait le lien entre les composants physiques et le comportement attendu du prototype. Cette méthode permet de tester rapidement plusieurs choix techniques, d’intégrer les composants progressivement et de vérifier le fonctionnement du dispositif avant d’envisager une version plus aboutie.',
        context: 'Projet orienté vers la conception d’une solution technique d’assistance en tenant compte du besoin utilisateur et de la faisabilité du prototype.', problem: 'Comment transformer un besoin d’assistance en une solution technique concrète ?', solution: 'Démarche de conception et de prototypage combinant électronique, programmation et intégration de composants.', architecture: 'Besoin → conception → électronique → programmation → prototype → validation', hardware: ['Microcontrôleur', 'Composants électroniques', 'Éléments du prototype'], software: ['Programmation embarquée'], results: ['Prototype fonctionnel exploré', 'Intégration électronique et programmation réalisées'], role: 'Conception, prototypage et intégration technique.', technologies: ['Électronique', 'Microcontrôleurs', 'Prototypage'], features: ['Analyse du besoin', 'Conception', 'Intégration électronique', 'Validation fonctionnelle']
    },
    {
        slug: 'gmao-hospitaliere', title: 'GMAO hospitalière open source', category: 'Génie biomédical · Logiciel',
        summary: 'Concept d’une plateforme locale de gestion de maintenance destinée aux techniciens biomédicaux hospitaliers.',
        description: 'La plateforme est pensée autour d’un modèle de données représentant les équipements, leurs interventions et leur historique. L’interface permet au technicien de retrouver un équipement, d’enregistrer une opération et de conserver les informations nécessaires au suivi. La logique applicative relie les formulaires, la base de données et les règles de maintenance afin de transformer une intervention ponctuelle en historique exploitable. L’objectif est ainsi de passer d’informations dispersées à une traçabilité structurée des opérations de maintenance.',
        context: 'Projet de conception logicielle inspiré des besoins de suivi des équipements, des interventions et de la maintenance hospitalière.', problem: 'Comment améliorer la traçabilité des équipements et des opérations de maintenance dans un établissement de santé ?', solution: 'Conception d’une plateforme locale organisée autour de l’inventaire, des interventions, de la maintenance préventive et corrective et de l’historique.', architecture: 'Équipements → inventaire → interventions → historique → suivi de maintenance', hardware: [], software: ['Application web', 'Base de données', 'Logique de gestion de maintenance'], results: ['Concept fonctionnel défini', 'Organisation des données adaptée à la maintenance biomédicale'], role: 'Conception fonctionnelle et développement du concept.', technologies: ['Web', 'Base de données', 'Maintenance biomédicale'], features: ['Inventaire', 'Suivi des interventions', 'Maintenance préventive', 'Historique des pannes', 'Traçabilité']
    },
    {
        slug: 'medura', title: 'MEDORA : assistant médical vocal', youtubeVideoId: 'rjDjWgu2xgs', category: 'Technologie médicale · Assistant vocal · Systèmes embarqués',
        summary: 'Prototype d’assistant médical vocal : une interface web répond aux questions, la voix est synthétisée par Piper puis envoyée à un ESP32 qui la transmet en Bluetooth à un casque.',
        description: 'L’utilisateur pose sa question dans une interface web. Un serveur Python (FastAPI) choisit la réponse à partir d’une soixantaine de règles de dialogue, puis la transmet à un second serveur dédié à la voix. Celui-ci synthétise la phrase en français avec Piper (voix siwis, 22 050 Hz, mono, 16 bits), puis envoie l’audio par liaison série à 460 800 bauds vers un ESP32. L’envoi est cadencé par blocs de 100 ms pour respecter le débit de lecture, et les phrases sont placées dans une file d’attente pour être dites l’une après l’autre. L’ESP32 transmet ensuite le son en Bluetooth vers un casque P47. Un boîtier a aussi été modélisé sous SolidWorks : écran d’accueil, petit afficheur d’état, haut-parleur et ouvertures de ventilation.',
        context: 'Projet personnel d’assistant médical vocal, pensé comme une première version fonctionnelle de bout en bout, avant d’y ajouter de l’intelligence artificielle, un microphone et une mémoire.', problem: 'Comment faire parler un assistant médical hors ligne, sur du matériel simple, sans dépendre d’un service en ligne pour la voix ?', solution: 'Séparer le projet en deux serveurs : un pour le dialogue et l’interface web, un pour la synthèse vocale locale avec Piper et l’envoi de l’audio à un ESP32 qui sert de relais Bluetooth.', architecture: 'Interface web → serveur de dialogue (FastAPI) → serveur vocal (Piper) → liaison série → ESP32 → Bluetooth → casque', hardware: ['ESP32', 'Casque Bluetooth P47', 'Ordinateur (Linux)', 'Boîtier modélisé sous SolidWorks'], software: ['Python', 'FastAPI', 'Piper TTS', 'PySerial', 'Interface web'], results: ['Chaîne complète question → réponse → voix → casque réalisée', 'Synthèse vocale locale en français, sans service en ligne', 'Débit série cadencé et file d’attente audio pour éviter les coupures', 'Boîtier MEDORA modélisé en 3D'], role: 'Conception de l’architecture, développement des serveurs, intégration de l’ESP32 et modélisation du boîtier.', technologies: ['Python', 'FastAPI', 'Piper TTS', 'ESP32', 'Bluetooth', 'SolidWorks'], features: ['Interface web de dialogue', 'Réponses par règles (60 questions types)', 'Synthèse vocale locale en français', 'Transmission audio série vers ESP32', 'Sortie Bluetooth vers casque', 'File d’attente des phrases'], media: [
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/medora/boitier.jpg`, alt: 'Modèle 3D du boîtier MEDORA de l’assistant médical vocal, avec écran, haut-parleur et ouvertures de ventilation' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/medora/interface-web.jpg`, alt: 'Interface web de l’assistant médical : conversation avec les boutons Envoyer et parler et Arrêter la conversation' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/medora/esp32-haut-parleurs.jpg`, alt: 'Carte ESP32 sur platine d’essai avec batterie, module audio et haut-parleurs' }
        ]
    },
    {
        slug: 'dicom-anonymizer', title: 'DICOM Anonymizer', category: 'Imagerie médicale · Données DICOM · Python',
        summary: 'Pipeline Python pour explorer, contrôler et anonymiser une série d’images CT au format DICOM, première étape avant toute exploitation 3D ou robotisée.',
        description: 'Chaque image DICOM contient les pixels de la coupe mais aussi des métadonnées : identité du patient, géométrie, position dans l’espace. La bibliothèque pydicom permet de lire ces informations ; matplotlib affiche la coupe en niveaux de gris à partir du tableau de pixels. Un script parcourt ensuite toute la série pour relever la position Z de chaque coupe et vérifier que l’espacement est régulier. Enfin, le script d’anonymisation remplace le nom, la date de naissance et l’identifiant du patient, puis enregistre chaque fichier dans un dossier séparé sans modifier l’original. Les données viennent d’un jeu public du NIST (fantôme de calibration CT) : aucune donnée de patient réel n’est utilisée.',
        context: 'Avant d’utiliser des images médicales pour la reconstruction 3D, la navigation ou la planification robotisée, il faut maîtriser à la fois leur géométrie et la gestion sécurisée des données. Ce projet est une première étape d’apprentissage dans cette direction.', problem: 'Comment exploiter les métadonnées DICOM d’une série de coupes CT, vérifier leur cohérence spatiale et automatiser une première anonymisation ?', solution: 'Quatre scripts complémentaires : lecture des métadonnées d’un fichier, vérification de la série (position Z de chaque coupe), affichage d’une coupe, puis anonymisation par lot vers un dossier de sortie.', architecture: 'Fichiers DICOM → lecture pydicom → vérification de la série → anonymisation → fichiers anonymisés', hardware: [], software: ['Python', 'pydicom', 'matplotlib', 'Scripts en ligne de commande'], results: ['Série de 24 coupes analysée : espacement régulier de 0,6 mm selon l’axe Z', 'Affichage d’une coupe CT de 512 × 512 pixels à partir du tableau de pixels', 'Anonymisation du nom, de la date de naissance et de l’identifiant, sans modifier les fichiers sources', 'Limites identifiées : tags privés, autres attributs et informations incrustées dans les pixels non traités'], role: 'Conception et développement des scripts, analyse de la série et rédaction de la documentation.', technologies: ['Python', 'pydicom', 'matplotlib', 'DICOM', 'Imagerie CT'], features: ['Lecture des métadonnées DICOM', 'Vérification de l’espacement des coupes', 'Affichage d’une coupe en niveaux de gris', 'Anonymisation par lot', 'Fichiers originaux préservés'], media: [
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/dicom/coupe-ct.png`, alt: 'Coupe CT affichée avec matplotlib à partir du tableau de pixels DICOM' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/dicom/verification-serie.png`, alt: 'Sortie du script de vérification : position Z des 24 coupes de la série' }
        ],
        links: [{ label: 'Voir le code sur GitHub', url: 'https://github.com/djohozinc-ship-it/dicom-anonymizer' }]
    },
    {
        slug: 'emg-neuropathie-matlab', title: 'Analyse EMG de la neuropathie périphérique', category: 'Traitement du signal · Biosignaux · MATLAB',
        summary: 'Étude de cas en acquisition et traitement des signaux biomédicaux : filtrage et analyse spectrale sous MATLAB de deux électromyogrammes à l’aiguille, un normal et un neuropathique.',
        description: 'Les données sont deux fichiers texte à deux colonnes (temps, amplitude), enregistrés avec une électrode à aiguille concentrique dans le muscle tibial antérieur, l’un pour un sujet sain, l’autre pour un patient atteint de neuropathie. Sous MATLAB, une transformée de Fourier (fft) du signal brut montre où se trouve l’énergie : en dessous de 20 Hz, des artefacts de mouvement et de la dérive ; au-delà de 400 à 450 Hz, surtout du bruit. Un filtre passe-bande de Butterworth d’ordre 4 (20 à 450 Hz, fréquence d’échantillonnage de 4 kHz) est alors appliqué avec filter. Le spectre du signal filtré est recalculé pour vérifier que la bande utile est conservée. Les deux tracés, traités de la même façon, sont enfin comparés dans le domaine temporel et dans le domaine fréquentiel.',
        context: 'Les neuropathies périphériques touchent les nerfs situés en dehors du cerveau et de la moelle épinière. L’électromyographie enregistre l’activité électrique du muscle et aide à les distinguer d’une atteinte musculaire. Ce travail de groupe a été réalisé en 3e année de génie biomédical (EPAC, UAC), dans le cours d’acquisition et de traitement des signaux biomédicaux, sous la supervision du Dr TOGNISSE Ida.', problem: 'Comment un traitement du signal rigoureux permet-il de distinguer un tracé EMG normal d’un tracé pathologique ?', solution: 'Analyse spectrale pour choisir la bande utile, filtrage passe-bande 20 à 450 Hz sous MATLAB, vérification par un second spectre, puis comparaison des deux signaux.', architecture: 'Fichier EMG (.txt) → chargement MATLAB → FFT du signal brut → choix de la bande → filtre passe-bande → vérification spectrale → comparaison normal / pathologique', hardware: ['Électrode à aiguille concentrique (25 mm)', 'Câble blindé et préamplificateur différentiel (chaîne décrite dans l’étude)', 'Système d’EMG Medelec Synergy N2 (source des données)'], software: ['MATLAB R2022b', 'fft, butter et filter', 'Filtre de Butterworth passe-bande'], results: ['Amplitude maximale d’environ 0,6 µV pour le signal normal contre environ 4,5 µV pour le signal pathologique, soit des pics 7 à 8 fois plus grands', 'Tracé pathologique peu dense, avec des potentiels d’unité motrice de grande amplitude et de longue durée', 'Spectre pathologique concentré vers les basses fréquences, sous 400 Hz', 'Limites : dépendance au matériel et au bruit, interprétation parfois subjective, valeurs de référence non universelles'], role: 'Travail de groupe : revue bibliographique, écriture du script MATLAB (FFT, filtrage, vérification), traitement des deux signaux et interprétation des résultats.', technologies: ['MATLAB', 'EMG', 'FFT', 'Filtre de Butterworth', 'Traitement du signal'], features: ['Chargement et analyse de signaux EMG', 'Analyse spectrale par FFT', 'Filtre passe-bande 20 à 450 Hz', 'Comparaison sujet sain et sujet neuropathique', 'Perspectives : détection automatique des potentiels d’unité motrice et classification par IA'], media: [
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/emg/matlab-script.jpg`, alt: 'Environnement MATLAB : script de filtrage et figures du signal EMG et de ses spectres' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/emg/spectre-brut.jpg`, alt: 'Spectre en fréquence du signal EMG brut du patient neuropathique' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/emg/spectre-filtre.jpg`, alt: 'Spectre en fréquence du signal EMG après filtrage passe-bande' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/emg/signal-pathologique.jpg`, alt: 'Signal EMG filtré du patient souffrant de neuropathie, avec des pics jusqu’à environ 4,5 µV' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/emg/signal-normal.jpg`, alt: 'Signal EMG filtré du sujet normal, avec des pics d’environ 0,6 µV' }
        ]
    },
    {
        slug: 'thermostat-solidworks', title: 'Thermostat – conception CAO', category: 'Conception mécanique · CAO',
        summary: 'Modélisation d’un thermostat dans le cadre d’un exercice de conception assistée par ordinateur.',
        description: 'SolidWorks est utilisé pour passer d’une représentation fonctionnelle à une représentation géométrique exploitable. Les différentes pièces sont modélisées en 3D avec leurs dimensions et contraintes, puis regroupées dans un assemblage afin de vérifier leur position relative et leur intégration. L’intérêt de cette démarche est de visualiser le fonctionnement mécanique avant une éventuelle fabrication et d’identifier les incohérences géométriques directement dans le modèle numérique.',
        context: 'Projet de conception utilisant la CAO pour représenter les pièces et étudier leur intégration.', problem: 'Comment représenter et assembler un système en tenant compte de sa géométrie ?', solution: 'Modélisation 3D et assemblage à l’aide de SolidWorks.', architecture: 'Besoin → modélisation → pièces → assemblage → vérification', hardware: ['Composants mécaniques du modèle'], software: ['SolidWorks'], results: ['Modèle 3D réalisé', 'Assemblage étudié'], role: 'Modélisation et conception du prototype.', technologies: ['SolidWorks', 'CAO'], features: ['Modélisation 3D', 'Assemblage', 'Étude d’intégration']
    },
    {
        slug: 'mor-eyes', title: 'MorEyesCommunicator (MEC)', category: 'Technologie d’assistance · Vision artificielle · Communication',
        summary: 'Système de suppléance oratoire assisté par vision artificielle : les clignements volontaires deviennent des commandes, puis de la parole. Son logiciel se nomme MorEyes Pro.',
        description: 'Une caméra filme le visage en temps réel. MediaPipe repère les points des yeux et détermine si les paupières sont ouvertes ou fermées, et OpenCV gère le flux vidéo et l’affichage. La durée des clignements permet de distinguer les commandes : un clignement court pour une commande simple, un long pour valider, un double clignement pour une action spécifique. Deux modes de saisie sont proposés : une sélection par balayage automatique, et un mode inspiré du code Morse. Le message construit est lu à voix haute hors ligne par pyttsx3. L’interface MorEyes Pro, réalisée avec CustomTkinter, regroupe le mode Morse, les phrases rapides, l’historique et les paramètres, stockés localement dans SQLite. Une petite chaîne électronique LED + LDR complète l’approche logicielle.',
        context: 'Après un AVC, avec la SLA ou dans un syndrome d’enfermement, une personne peut rester consciente mais ne plus pouvoir parler. Le regard et les paupières restent souvent mobiles, car les nerfs crâniens III, IV, VI et VII commandent les muscles des yeux et des paupières.', problem: 'Comment permettre à une personne sévèrement privée de parole de transmettre un message à son entourage uniquement à partir de mouvements oculaires volontaires ?', solution: 'Détecter les clignements par vision artificielle, les interpréter comme des commandes, composer un message puis le restituer par synthèse vocale locale.', architecture: 'Caméra → vision artificielle → clignements → commandes → message → voix', hardware: ['Caméra', 'Ordinateur', 'Montage LED + LDR', 'Maquette à servomoteurs pour les tests'], software: ['Python', 'MediaPipe', 'OpenCV', 'pyttsx3', 'CustomTkinter', 'SQLite3'], results: ['Chaîne complète caméra → commande → voix fonctionnelle (V1.0)', 'Deux modes de saisie : balayage automatique et mode Morse', 'Logiciel MorEyes Pro avec phrases rapides, historique et paramètres', 'Restitution vocale entièrement hors ligne'], role: 'Projet d’équipe réalisé avec Caleb HOUNYO et Smiss Dossou LAWISSA : conception du concept, développement du traitement et expérimentation du système.', technologies: ['Python', 'MediaPipe', 'OpenCV', 'CustomTkinter', 'SQLite3', 'pyttsx3'], features: ['Détection des yeux et des clignements', 'Clignement court, long et double', 'Mode balayage et mode Morse', 'Phrases rapides et historique local', 'Sortie vocale hors ligne'], media: [
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/hero.jpg`, alt: 'Vue d’ensemble du système MorEyesCommunicator' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/prototype.jpg`, alt: 'Prototype du système MorEyesCommunicator' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/electronique.jpg`, alt: 'Montage électronique LED et LDR du projet' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/camera.jpg`, alt: 'Caméra utilisée pour l’acquisition du regard' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/utilisation.jpg`, alt: 'Utilisation du système par un utilisateur' },
            { type: 'image', src: `${process.env.PUBLIC_URL}/images/projects/mor-eyes/test.jpg`, alt: 'Phase de test du système' }
        ],
        videos: [
            { id: 'qimwWCac6hs', label: 'Présentation', title: 'Présentation du projet (avec musique)' },
            { id: 'O3Fx02_vQ4U', label: 'Démonstration', title: 'Démonstration : comment ça marche vraiment' }
        ]
    }
];

function ProjectDetails() {
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const slug = hash.startsWith('#/project/') ? hash.replace('#/project/', '').split('?')[0] : '';
    const project = useMemo(() => projects.find((item) => item.slug === slug), [slug]);

    if (!project) {
        return <main className="project-details-page"><button className="project-back" onClick={() => { window.location.hash = '#projects'; }}><FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets</button><div className="project-not-found"><h1>Projet introuvable</h1><p>Ce projet n’existe pas ou son identifiant a changé.</p></div></main>;
    }

    return (
        <main className="project-details-page">
            <button className="project-back" onClick={() => { window.location.hash = '#projects'; }}><FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets</button>
            <section className="project-hero-premium">
                <div className="project-hero-copy"><span className="project-category">{project.category}</span><h1 className={project.title.length > 22 ? 'is-long-title' : undefined}>{project.title}</h1><p>{project.summary}</p><div className="project-hero-meta"><span><FontAwesomeIcon icon={faBullseye} /> Projet personnel / académique</span><span><FontAwesomeIcon icon={faCogs} /> Conception & prototypage</span>{project.links?.map((link) => <a key={link.url} className="project-hero-link" href={link.url} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /> {link.label}</a>)}</div></div>
                <div className="project-hero-visual">{project.media?.find((media) => media.type === 'image') ? <img className="project-hero-image" src={project.media.find((media) => media.type === 'image')!.src} alt={project.media.find((media) => media.type === 'image')!.alt} /> : <><div className="hero-grid" /><div className="hero-orb"><FontAwesomeIcon icon={faMicrochip} /></div><span>PROJECT<br />CASE STUDY</span></>}</div>
            </section>

            <div className="project-story">
                <div className="project-overview">
                    <article><span className="section-kicker">Contexte</span><p>{project.context}</p></article>
                    <article><span className="section-kicker">Problème</span><p>{project.problem}</p></article>
                    <article><span className="section-kicker">Solution</span><p>{project.solution}</p></article>
                </div>

                <section className="project-story-section"><span className="section-kicker">Description & réalisation</span><h2><FontAwesomeIcon icon={faLightbulb} /> Comment les technologies ont été exploitées</h2><p>{project.description}</p></section>

                <section className="project-story-section"><span className="section-kicker">Architecture</span><h2><FontAwesomeIcon icon={faCodeBranch} /> Architecture du système</h2><div className="architecture-card"><div className="architecture-flow">{project.architecture.split(' → ').map((step, index, steps) => <React.Fragment key={`${step}-${index}`}><span>{step}</span>{index < steps.length - 1 && <b>→</b>}</React.Fragment>)}</div></div></section>

                <div className={`project-columns${project.hardware.length ? '' : ' project-columns--single'}`}>
                    {project.hardware.length ? <section className="project-story-section"><span className="section-kicker">Matériel</span><h2><FontAwesomeIcon icon={faMicrochip} /> Matériel & électronique</h2><ul className="project-list">{project.hardware.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
                    <section className="project-story-section"><span className="section-kicker">Logiciel</span><h2><FontAwesomeIcon icon={faLaptopCode} /> Logiciel & programmation</h2><ul className="project-list">{project.software.map((item) => <li key={item}>{item}</li>)}</ul></section>
                </div>

                <section className="project-story-section"><span className="section-kicker">Résultats</span><h2><FontAwesomeIcon icon={faChartLine} /> Résultats & avancées</h2><div className="results-grid">{project.results.map((item, index) => <div className="result-card" key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div></section>

                <div className="project-columns">
                    <section className="project-story-section"><span className="section-kicker">Mon rôle</span><h2>Contribution au projet</h2><p>{project.role}</p></section>
                    <section className="project-story-section"><span className="section-kicker">Technologies</span><h2>Technologies utilisées</h2><div className="project-chips">{project.technologies.map((tech) => <Chip key={tech} label={tech} />)}</div></section>
                </div>

                <section className="project-story-section"><span className="section-kicker">Fonctionnalités</span><h2>Points clés</h2><ul className="project-list project-list--grid">{project.features.map((item) => <li key={item}>{item}</li>)}</ul></section>

                {project.media?.length ? <section className="project-story-section media-section"><span className="section-kicker">Médias</span><h2><FontAwesomeIcon icon={faImages} /> Documentation du projet</h2><PremiumMediaGallery media={project.media} /></section> : null}
                {project.youtubeVideoId ? <section className="project-story-section video-section"><span className="section-kicker">Démonstration</span><h2><FontAwesomeIcon icon={faPlay} /> Démonstration vidéo du système</h2><div className="project-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${project.youtubeVideoId}?rel=0&modestbranding=1`} title={`Démonstration vidéo : ${project.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></section> : null}
                {project.videos?.length ? <section className="project-story-section video-section"><span className="section-kicker">Vidéos</span><h2><FontAwesomeIcon icon={faPlay} /> Présentation et démonstration</h2>{project.videos.map((video) => <div key={video.id} className="project-video-block"><h3 className="project-video-title">{video.title}</h3><div className="project-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`} title={video.title} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div>)}</section> : null}
            </div>
        </main>
    );
}

export default ProjectDetails;
