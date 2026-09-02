import React, { useEffect, useMemo, useState } from "react";
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCodeBranch, faImages, faPlayCircle, faMicrochip, faLaptopCode, faLightbulb, faBullseye, faCogs, faChartLine } from '@fortawesome/free-solid-svg-icons';
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
    links?: { label: string; url: string }[];
};

export const projects: ProjectData[] = [
    {
        slug: 'sacruro', title: 'SACRURO', category: 'Génie biomédical · IoT · Gestion de l’eau',
        summary: 'Projet de récupération et de valorisation du concentrat rejeté par les unités de dialyse pour des usages non potables.',
        description: 'Le système exploite un ESP32 comme unité centrale pour coordonner l’acquisition, la logique de contrôle et la communication. L’ADS1115 est utilisé pour améliorer l’acquisition des signaux analogiques, tandis que le MCP23017 étend les entrées/sorties nécessaires aux commandes et aux indicateurs. Les mesures sont traitées par le firmware embarqué, puis les états du système sont transmis par MQTT à l’application mobile React Native. Les pompes et les électrovannes sont commandées selon la logique de fonctionnement définie. Lorsque la connexion MQTT n’est pas disponible, le mode point d’accès de l’ESP32 permet de conserver une commande locale. Le watchdog TLC555 apporte une surveillance matérielle indépendante pour renforcer la continuité du système. L’ensemble relie donc capteurs, électronique, firmware, communication et supervision afin d’obtenir un système de récupération et de distribution contrôlé.',
        context: 'Projet réalisé dans le cadre du génie biomédical et de mon mémoire autour de la réutilisation du concentrat issu de l’osmose inverse d’une unité de dialyse.', problem: 'Comment récupérer, surveiller et distribuer cette eau de manière contrôlée tout en intégrant les contraintes d’un environnement hospitalier ?', solution: 'Conception d’un système combinant électronique embarquée, acquisition de paramètres, commande des actionneurs et supervision mobile. Le prototype intègre également un mode local pour conserver une commande du système lorsque la communication distante n’est pas disponible.', architecture: 'Capteurs → acquisition → ESP32 → logique de contrôle → pompes et électrovannes → supervision mobile', hardware: ['ESP32 DevKit V1 / ESP32-WROOM-32E', 'ADS1115', 'MCP23017', 'Capteurs de mesure', 'Pompes', '6 électrovannes', 'Watchdog TLC555', 'Alimentations 5 V / 3,3 V / 24 V'], software: ['Firmware embarqué C/C++', 'MQTT', 'Application mobile React Native', 'Expo', 'Mode local ESP32 AP'], results: ['Prototype et architecture du système développés', 'Chaîne d’acquisition et de commande étudiée', 'Application mobile de supervision développée', 'Mode local intégré comme solution de continuité', 'Projet orienté vers la réduction du gaspillage d’eau en milieu hospitalier'], role: 'Conception du système, électronique, firmware, logique de contrôle et développement de l’interface mobile.', technologies: ['ESP32', 'C/C++', 'ADS1115', 'MCP23017', 'MQTT', 'React Native', 'Expo', 'KiCad'], features: ['Acquisition de paramètres', 'Commande des pompes et électrovannes', 'Supervision MQTT', 'Mode local ESP32', 'Surveillance par watchdog']
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
        slug: 'medura', title: 'Medura', category: 'Technologie médicale · Application',
        summary: 'Prototype numérique orienté vers l’assistance et l’organisation de l’information dans le domaine de la santé.',
        description: 'React est utilisé pour découper l’interface en composants réutilisables, tandis que TypeScript permet de structurer les données et les échanges entre les composants. L’application est organisée afin de séparer l’affichage, la logique et les données. Cette organisation facilite l’évolution du prototype : une fonctionnalité peut être ajoutée ou modifiée sans reconstruire toute l’interface. Le résultat recherché est une application claire, modulaire et adaptée à l’exploration de besoins numériques en santé.',
        context: 'Projet d’exploration d’une interface numérique appliquée à un besoin d’assistance dans le domaine de la santé.', problem: 'Comment structurer une interface simple et accessible autour d’un besoin numérique en santé ?', solution: 'Développement d’un prototype web modulaire avec une organisation claire de l’interface et des informations.', architecture: 'Interface → composants → logique applicative → données', hardware: [], software: ['React', 'TypeScript', 'Application web'], results: ['Prototype d’interface développé', 'Architecture modulaire explorée'], role: 'Conception et développement du prototype.', technologies: ['React', 'TypeScript', 'Web'], features: ['Interface utilisateur', 'Organisation de l’information', 'Composants modulaires']
    },
    {
        slug: 'gbm-learn', title: 'GBM Learn', category: 'Éducation · Génie biomédical · Web',
        summary: 'Projet numérique destiné à structurer des ressources d’apprentissage autour du génie biomédical.',
        description: 'Le projet exploite une architecture web par composants pour séparer la navigation, la présentation des contenus et leur organisation thématique. React permet de réutiliser les mêmes composants pour différents types de ressources, tandis que TypeScript apporte une structure plus claire aux données affichées. La logique consiste à transformer un ensemble de ressources en parcours de consultation organisé : thème, contenu, ressource puis navigation vers l’élément suivant. Cette approche permet d’obtenir une base facilement extensible pour une future plateforme pédagogique.',
        context: 'Projet personnel visant à explorer une plateforme pédagogique dédiée aux notions et ressources du génie biomédical.', problem: 'Comment organiser des ressources pédagogiques de manière simple et accessible ?', solution: 'Conception d’une interface web structurée par thèmes et ressources.', architecture: 'Interface → contenus → organisation thématique → consultation', hardware: [], software: ['React', 'TypeScript', 'Web'], results: ['Concept de plateforme pédagogique défini', 'Organisation thématique des ressources étudiée'], role: 'Conception du concept et développement de l’interface.', technologies: ['React', 'TypeScript', 'Web'], features: ['Organisation des ressources', 'Interface pédagogique', 'Navigation thématique']
    },
    {
        slug: 'thermostat-solidworks', title: 'Thermostat – conception CAO', category: 'Conception mécanique · CAO',
        summary: 'Modélisation d’un thermostat dans le cadre d’un exercice de conception assistée par ordinateur.',
        description: 'SolidWorks est utilisé pour passer d’une représentation fonctionnelle à une représentation géométrique exploitable. Les différentes pièces sont modélisées en 3D avec leurs dimensions et contraintes, puis regroupées dans un assemblage afin de vérifier leur position relative et leur intégration. L’intérêt de cette démarche est de visualiser le fonctionnement mécanique avant une éventuelle fabrication et d’identifier les incohérences géométriques directement dans le modèle numérique.',
        context: 'Projet de conception utilisant la CAO pour représenter les pièces et étudier leur intégration.', problem: 'Comment représenter et assembler un système en tenant compte de sa géométrie ?', solution: 'Modélisation 3D et assemblage à l’aide de SolidWorks.', architecture: 'Besoin → modélisation → pièces → assemblage → vérification', hardware: ['Composants mécaniques du modèle'], software: ['SolidWorks'], results: ['Modèle 3D réalisé', 'Assemblage étudié'], role: 'Modélisation et conception du prototype.', technologies: ['SolidWorks', 'CAO'], features: ['Modélisation 3D', 'Assemblage', 'Étude d’intégration']
    },
    {
        slug: 'arduino-jump-game', title: 'Jeu Arduino', category: 'Électronique · Arduino · Programmation',
        summary: 'Petit projet expérimental réalisé autour d’Arduino pour travailler l’interaction entre électronique et programmation.',
        description: 'Arduino sert de contrôleur entre les entrées utilisateur et la logique du jeu. Le programme lit les états des entrées, applique les règles du jeu et commande les sorties correspondantes. Cette organisation permet de comprendre concrètement la relation entre le matériel et le logiciel : une action physique devient une information numérique, cette information est interprétée par le programme, puis une sortie est produite. Le projet constitue ainsi un exercice complet d’interaction entre électronique et programmation embarquée.',
        context: 'Projet d’apprentissage destiné à mettre en pratique la programmation d’un microcontrôleur et la gestion d’entrées/sorties.', problem: 'Comment transformer des entrées utilisateur en logique de jeu sur une plateforme embarquée ?', solution: 'Développement d’une logique de jeu simple avec Arduino et des composants d’entrée/sortie.', architecture: 'Entrées utilisateur → Arduino → logique du jeu → sortie', hardware: ['Carte Arduino', 'Composants électroniques d’entrée/sortie'], software: ['Arduino IDE', 'C/C++'], results: ['Logique de jeu expérimentée', 'Programmation des entrées/sorties mise en pratique'], role: 'Programmation et intégration électronique du prototype.', technologies: ['Arduino', 'Arduino IDE', 'C/C++', 'Électronique'], features: ['Gestion des entrées', 'Logique embarquée', 'Gestion des sorties']
    },
    {
        slug: 'blender-tower', title: 'Modélisation 3D – Tower', category: 'Modélisation 3D · Blender',
        summary: 'Projet de modélisation 3D réalisé avec Blender pour développer les bases de conception et de représentation numérique.',
        description: 'Blender est utilisé pour construire progressivement la structure 3D à partir d’éléments géométriques, les positionner puis les assembler afin d’obtenir la forme finale. Le travail porte sur la transformation d’une référence ou d’une idée en objets numériques manipulables, puis sur leur organisation dans une scène. Le rendu permet enfin de vérifier visuellement les volumes, les proportions et la composition globale du modèle.',
        context: 'Projet personnel de découverte et de pratique de la modélisation 3D.', problem: 'Comment construire et représenter un objet ou une structure en environnement 3D ?', solution: 'Création et assemblage d’éléments 3D dans Blender.', architecture: 'Référence → modélisation → assemblage → rendu', hardware: [], software: ['Blender'], results: ['Modèle 3D réalisé', 'Pratique de la modélisation et du rendu développée'], role: 'Modélisation et réalisation du projet 3D.', technologies: ['Blender', 'Modélisation 3D'], features: ['Modélisation', 'Assemblage', 'Rendu']
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
                <div className="project-hero-copy"><span className="project-category">{project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="project-hero-meta"><span><FontAwesomeIcon icon={faBullseye} /> Projet personnel / académique</span><span><FontAwesomeIcon icon={faCogs} /> Conception & prototypage</span></div></div>
                <div className="project-hero-visual"><div className="hero-grid" /><div className="hero-orb"><FontAwesomeIcon icon={faMicrochip} /></div><span>PROJECT<br />CASE STUDY</span></div>
            </section>

            <div className="project-story">
                <section className="project-story-section intro-section"><div className="section-kicker">01 · CONTEXTE</div><div><h2><FontAwesomeIcon icon={faLightbulb} /> Pourquoi ce projet ?</h2><p>{project.context}</p></div></section>
                <section className="project-story-section description-section"><div className="section-kicker">02 · DESCRIPTION & RÉALISATION</div><h2><FontAwesomeIcon icon={faCogs} /> Comment les technologies ont été exploitées</h2><p>{project.description}</p></section>
                <section className="project-story-section split-section"><div><div className="section-kicker">03 · PROBLÈME</div><h2>Le défi technique</h2></div><div className="story-highlight"><p>{project.problem}</p></div></section>
                <section className="project-story-section"><div className="section-kicker">04 · SOLUTION</div><h2>Une réponse pensée comme un système</h2><p>{project.solution}</p></section>
                <section className="project-story-section architecture-section"><div className="section-kicker">05 · ARCHITECTURE</div><h2><FontAwesomeIcon icon={faCodeBranch} /> Architecture du système</h2><div className="architecture-card"><div className="architecture-flow">{project.architecture.split(' → ').map((step, index, steps) => <React.Fragment key={`${step}-${index}`}><span>{step}</span>{index < steps.length - 1 && <b>→</b>}</React.Fragment>)}</div></div></section>
                <section className="project-story-section"><div className="section-kicker">06 · HARDWARE</div><h2><FontAwesomeIcon icon={faMicrochip} /> Matériel & électronique</h2>{project.hardware.length ? <div className="technical-grid">{project.hardware.map(item => <div className="technical-card" key={item}><FontAwesomeIcon icon={faMicrochip} /><span>{item}</span></div>)}</div> : <div className="empty-technical">Aucun élément matériel spécifique pour ce projet.</div>}</section>
                <section className="project-story-section"><div className="section-kicker">07 · SOFTWARE</div><h2><FontAwesomeIcon icon={faLaptopCode} /> Logiciel & programmation</h2><div className="software-list">{project.software.map(item => <div key={item}><span className="number-dot">✓</span>{item}</div>)}</div></section>
                <section className="project-story-section results-section"><div className="section-kicker">08 · RÉSULTATS</div><h2><FontAwesomeIcon icon={faChartLine} /> Résultats & avancées</h2><div className="results-grid">{project.results.map((item, index) => <div className="result-card" key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div></section>
                <section className="project-story-section"><div className="section-kicker">09 · MON RÔLE</div><h2>Contribution au projet</h2><p>{project.role}</p></section>
                <section className="project-story-section"><div className="section-kicker">10 · TECHNOLOGIES</div><h2>Technologies utilisées</h2><div className="project-chips">{project.technologies.map(tech => <Chip key={tech} label={tech} />)}</div></section>
                <section className="project-story-section"><div className="section-kicker">11 · FONCTIONNALITÉS</div><h2>Points clés</h2><div className="software-list">{project.features.map(item => <div key={item}><span className="number-dot">✓</span>{item}</div>)}</div></section>
                {project.media?.length ? <section className="project-story-section media-section"><div className="section-kicker">12 · MÉDIAS</div><h2><FontAwesomeIcon icon={faImages} /> Documentation du projet</h2><div className="project-media-grid">{project.media.map((media, index) => media.type === 'image' ? <figure key={`${media.src}-${index}`}><img src={media.src} alt={media.alt} loading="lazy" /></figure> : <figure key={`${media.src}-${index}`} className="video-placeholder"><FontAwesomeIcon icon={faPlayCircle} /><figcaption>{media.alt}</figcaption></figure>)}</div></section> : null}
            </div>
        </main>
    );
}

export default ProjectDetails;
