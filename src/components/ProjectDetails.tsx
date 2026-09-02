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
        slug: 'sacruro',
        title: 'SACRURO',
        category: 'Génie biomédical · IoT · Gestion de l’eau',
        summary: 'Système intelligent de récupération et de valorisation du concentrat rejeté par les unités de dialyse.',
        context: 'Dans une unité de dialyse, l’osmose inverse produit un volume important de concentrat rejeté. SACRURO part de ce constat pour transformer une ressource habituellement évacuée en une ressource valorisable pour des usages non potables.',
        problem: 'Comment récupérer, contrôler et distribuer ce concentrat de manière fiable tout en assurant la surveillance des paramètres et la sécurité du système ?',
        solution: 'SACRURO associe instrumentation, automatisation, électronique embarquée et supervision mobile. L’ESP32 pilote les actionneurs, acquiert les paramètres et communique avec l’interface de supervision. Un mode local permet également de conserver le contrôle lorsque la communication distante n’est pas disponible.',
        architecture: 'Capteurs et conditionnement → acquisition analogique/numérique → ESP32 → logique de contrôle → pompes et électrovannes. La supervision communique avec le système via MQTT, avec un mode local par point d’accès ESP32 comme solution de continuité.',
        hardware: ['ESP32 DevKit V1 / ESP32-WROOM-32E', 'ADS1115 pour l’acquisition analogique', 'MCP23017 pour les entrées/sorties', 'Capteurs de mesure', 'Pompes', 'Électrovannes', 'Watchdog TLC555', 'Alimentations 5 V / 3,3 V / 24 V'],
        software: ['Firmware embarqué en C/C++', 'MQTT', 'Application mobile React Native', 'Expo', 'Mode local ESP32 AP', 'Logique de contrôle et supervision'],
        results: ['Architecture de contrôle et de supervision définie', 'Chaîne d’acquisition et de commande intégrée au prototype', 'Supervision mobile développée', 'Mode local prévu pour assurer la continuité de fonctionnement', 'Projet orienté vers la réduction du gaspillage d’eau dans le contexte hospitalier'],
        role: 'Conception du système, électronique, firmware, logique de contrôle et développement de l’interface mobile.',
        technologies: ['ESP32', 'C/C++', 'ADS1115', 'MCP23017', 'MQTT', 'React Native', 'Expo', 'KiCad', 'Capteurs', 'Électrovannes', 'Pompes'],
        features: ['Mesure et acquisition des paramètres', 'Commande des pompes et électrovannes', 'Communication MQTT', 'Mode local avec point d’accès ESP32', 'Supervision depuis une application mobile', 'Surveillance par watchdog'],
        links: []
    },
    {
        slug: 'gmao-hospitaliere', title: 'GMAO hospitalière open source', category: 'Génie biomédical · Logiciel', summary: 'Concept de plateforme locale de gestion de maintenance pour les techniciens biomédicaux hospitaliers.',
        context: 'Les équipements biomédicaux nécessitent un suivi structuré des interventions, des pannes et des maintenances.', problem: 'Comment centraliser les informations techniques et améliorer la traçabilité de la maintenance hospitalière ?', solution: 'Une plateforme locale pensée autour de l’inventaire, des interventions et de la maintenance préventive et corrective.', architecture: 'Équipements → base de données → gestion des interventions → historique → tableaux de suivi.', hardware: [], software: ['Application web', 'Base de données', 'Logique de gestion de maintenance'], results: ['Concept fonctionnel défini', 'Organisation des données orientée maintenance biomédicale'], role: 'Conception fonctionnelle et développement du concept logiciel.', technologies: ['Web', 'Base de données', 'Maintenance biomédicale', 'IoT'], features: ['Inventaire des équipements', 'Suivi des interventions', 'Maintenance préventive', 'Historique des pannes', 'Traçabilité des opérations']
    },
    {
        slug: 'carte-donnees-biomedicales', title: 'Carte universelle de données biomédicales', category: 'Électronique · Instrumentation biomédicale', summary: 'Architecture électronique destinée à faciliter l’acquisition et l’intégration de données issues de capteurs biomédicaux.',
        context: 'Les prototypes biomédicaux utilisent souvent des capteurs et interfaces différents, ce qui peut complexifier leur intégration.', problem: 'Comment créer une base électronique modulaire capable d’accueillir plusieurs sources de données ?', solution: 'Une architecture autour d’un microcontrôleur et de modules d’acquisition permettant de connecter différents capteurs.', architecture: 'Capteurs → conditionnement → ADS1115/ADC → ESP32 → traitement → supervision.', hardware: ['ESP32', 'ADS1115', 'Interfaces capteurs', 'Électronique analogique et numérique'], software: ['Firmware embarqué', 'Traitement des données'], results: ['Architecture modulaire étudiée', 'Intégration de plusieurs interfaces d’acquisition'], role: 'Conception de l’architecture et étude de l’intégration des différents modules.', technologies: ['ESP32', 'ADC', 'ADS1115', 'Capteurs', 'Électronique analogique', 'Électronique numérique', 'KiCad'], features: ['Acquisition analogique', 'Interfaces capteurs', 'Traitement embarqué', 'Architecture modulaire', 'Communication avec système de supervision']
    },
    {
        slug: 'ppg-computer-vision', title: 'Estimation du rythme cardiaque par PPG et vision par ordinateur', category: 'IA · Computer Vision · Santé', summary: 'Exploration de l’estimation de paramètres physiologiques à partir de signaux vidéo.',
        context: 'La vision par ordinateur peut permettre d’extraire des variations physiologiques à partir de séquences vidéo.', problem: 'Comment exploiter les variations photométriques d’une zone du visage pour estimer le rythme cardiaque ?', solution: 'Une chaîne expérimentale combinant détection du visage, suivi d’une région d’intérêt et traitement du signal vidéo.', architecture: 'Caméra → MediaPipe/OpenCV → région d’intérêt → extraction du signal → traitement → estimation.', hardware: ['Caméra'], software: ['Python', 'OpenCV', 'MediaPipe', 'Traitement du signal'], results: ['Chaîne de traitement vidéo expérimentée', 'Exploration de l’estimation non contact du rythme cardiaque'], role: 'Développement et expérimentation de la chaîne de traitement.', technologies: ['Python', 'OpenCV', 'MediaPipe', 'Traitement du signal', 'Computer Vision'], features: ['Détection et suivi du visage', 'Extraction de variations photométriques', 'Traitement du signal', 'Estimation du rythme cardiaque']
    },
    {
        slug: 'medura', title: 'Medura', category: 'Technologie médicale · Application', summary: 'Concept de solution numérique orientée vers l’assistance et l’accès à l’information de santé.',
        context: 'Les outils numériques peuvent améliorer l’organisation et l’accessibilité de certaines informations de santé.', problem: 'Comment concevoir une interface numérique claire autour d’un besoin d’assistance en santé ?', solution: 'Un prototype web structuré autour d’une expérience utilisateur simple et d’une organisation modulaire de l’information.', architecture: 'Interface utilisateur → composants React → logique applicative → données.', hardware: [], software: ['React', 'TypeScript', 'Application web'], results: ['Prototype d’interface développé', 'Architecture modulaire étudiée'], role: 'Conception et développement du prototype.', technologies: ['React', 'TypeScript', 'Application web', 'UX/UI'], features: ['Interface utilisateur', 'Organisation de l’information', 'Architecture modulaire']
    },
    {
        slug: 'moyes-pro', title: 'Moyes Pro', category: 'Dispositif d’assistance · Prototypage', summary: 'Projet de technologie d’assistance visant à répondre à un besoin fonctionnel par une solution technique.',
        context: 'La conception de technologies d’assistance doit partir d’un besoin réel et intégrer contraintes d’usage, d’ergonomie et de faisabilité.', problem: 'Comment transformer un besoin fonctionnel en prototype technique utilisable ?', solution: 'Une démarche de conception et prototypage centrée sur l’utilisateur et l’intégration électronique.', architecture: 'Besoin utilisateur → conception → électronique → prototype → validation.', hardware: ['Microcontrôleurs', 'Composants électroniques', 'Prototype'], software: ['Programmation embarquée'], results: ['Prototype et intégration technique explorés', 'Validation fonctionnelle intégrée à la démarche'], role: 'Conception, prototypage et intégration technique.', technologies: ['Électronique', 'Microcontrôleurs', 'Prototypage', 'Conception de dispositif'], features: ['Analyse du besoin', 'Conception du prototype', 'Intégration électronique', 'Validation fonctionnelle']
    },
    {
        slug: 'thermostat-solidworks', title: 'Thermostat – conception CAO', category: 'Conception mécanique · CAO', summary: 'Conception et modélisation d’un thermostat avec approche de conception assistée par ordinateur.',
        context: 'La CAO permet de valider la géométrie et l’intégration mécanique avant fabrication.', problem: 'Comment modéliser un système compact en tenant compte de la géométrie et de l’intégration des composants ?', solution: 'Modélisation 3D et assemblage dans SolidWorks.', architecture: 'Besoin → conception CAO → pièces → assemblage → vérification.', hardware: ['Composants mécaniques du prototype'], software: ['SolidWorks'], results: ['Modèle 3D réalisé', 'Assemblage et intégration étudiés'], role: 'Modélisation et conception du prototype.', technologies: ['SolidWorks', 'CAO', 'Conception mécanique'], features: ['Modélisation 3D', 'Assemblage', 'Étude de l’intégration']
    },
    {
        slug: 'gbm-learn', title: 'GBM Learn', category: 'Éducation · Génie biomédical', summary: 'Projet numérique destiné à faciliter l’apprentissage et le partage de connaissances en génie biomédical.',
        context: 'Le génie biomédical couvre de nombreuses disciplines qui nécessitent des ressources pédagogiques structurées.', problem: 'Comment organiser et rendre accessibles des ressources orientées génie biomédical ?', solution: 'Une plateforme numérique pensée pour structurer des contenus et ressources pédagogiques.', architecture: 'Interface → contenus → organisation thématique → consultation.', hardware: [], software: ['React', 'TypeScript', 'Web'], results: ['Concept de plateforme pédagogique défini', 'Organisation de ressources orientée génie biomédical'], role: 'Conception du concept et développement de la plateforme.', technologies: ['Web', 'TypeScript', 'React'], features: ['Organisation de ressources', 'Interface pédagogique', 'Contenus orientés génie biomédical']
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

    if (!project) return <main className="project-details-page"><button className="project-back" onClick={() => { window.location.hash = '#projects'; }}><FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets</button><div className="project-not-found"><h1>Projet introuvable</h1><p>Ce projet n’existe pas ou son identifiant a changé.</p></div></main>;

    return (
        <main className="project-details-page">
            <button className="project-back" onClick={() => { window.location.hash = '#projects'; }}><FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets</button>

            <section className="project-hero-premium">
                <div className="project-hero-copy">
                    <span className="project-category">{project.category}</span>
                    <h1>{project.title}</h1>
                    <p>{project.summary}</p>
                    <div className="project-hero-meta"><span><FontAwesomeIcon icon={faBullseye} /> Projet technique</span><span><FontAwesomeIcon icon={faCogs} /> Conception & prototypage</span></div>
                </div>
                <div className="project-hero-visual"><div className="hero-grid" /><div className="hero-orb"><FontAwesomeIcon icon={faMicrochip} /></div><span>PROJECT<br />CASE STUDY</span></div>
            </section>

            <div className="project-story">
                <section className="project-story-section intro-section"><div className="section-kicker">01 · CONTEXTE</div><div><h2><FontAwesomeIcon icon={faLightbulb} /> Pourquoi ce projet ?</h2><p>{project.context}</p></div></section>
                <section className="project-story-section split-section"><div><div className="section-kicker">02 · PROBLÈME</div><h2>Le défi technique</h2></div><div className="story-highlight"><p>{project.problem}</p></div></section>
                <section className="project-story-section"><div className="section-kicker">03 · SOLUTION</div><h2>Une réponse pensée comme un système</h2><p>{project.solution}</p></section>
                <section className="project-story-section architecture-section"><div className="section-kicker">04 · ARCHITECTURE</div><h2><FontAwesomeIcon icon={faCodeBranch} /> Architecture du système</h2><div className="architecture-card"><div className="architecture-flow">{project.architecture.split(' → ').map((step, index) => <React.Fragment key={step}><span>{step}</span>{index < project.architecture.split(' → ').length - 1 && <b>→</b>}</React.Fragment>)}</div></div></section>

                <section className="project-story-section"><div className="section-kicker">05 · HARDWARE</div><h2><FontAwesomeIcon icon={faMicrochip} /> Matériel & électronique</h2>{project.hardware.length ? <div className="technical-grid">{project.hardware.map(item => <div className="technical-card" key={item}><FontAwesomeIcon icon={faMicrochip} /><span>{item}</span></div>)}</div> : <div className="empty-technical">Aucun élément matériel spécifique documenté pour ce projet.</div>}</section>
                <section className="project-story-section"><div className="section-kicker">06 · SOFTWARE</div><h2><FontAwesomeIcon icon={faLaptopCode} /> Logiciel & contrôle</h2><div className="software-list">{project.software.map(item => <div key={item}><span className="number-dot">✓</span>{item}</div>)}</div></section>
                <section className="project-story-section results-section"><div className="section-kicker">07 · RÉSULTATS</div><h2><FontAwesomeIcon icon={faChartLine} /> Résultats & avancées</h2><div className="results-grid">{project.results.map(item => <div key={item}><strong>+</strong><p>{item}</p></div>)}</div></section>

                <section className="project-story-section role-section"><div><div className="section-kicker">08 · CONTRIBUTION</div><h2>Mon rôle</h2></div><p>{project.role}</p></section>
                <section className="project-story-section"><div className="section-kicker">09 · TECHNOLOGIES</div><h2>Stack technique</h2><div className="project-chips">{project.technologies.map(technology => <Chip key={technology} label={technology} />)}</div></section>

                <section className="project-story-section project-media-section"><div className="section-kicker">10 · MÉDIAS</div><h2><FontAwesomeIcon icon={faImages} /> Galerie & démonstration</h2>{project.media?.length ? <div className="project-media-grid">{project.media.map(item => item.type === 'video' ? <video key={item.src} controls preload="metadata" src={item.src} aria-label={item.alt} /> : <img key={item.src} src={item.src} alt={item.alt} loading="lazy" decoding="async" />)}</div> : <div className="project-media-placeholder"><FontAwesomeIcon icon={faPlayCircle} size="2x" /><h3>Médias du projet à venir</h3><p>Les photos, captures d’écran, schémas et vidéos réelles seront intégrés ici.</p></div>}</section>
                {!!project.links?.length && <section className="project-story-section project-links"><div className="section-kicker">11 · RESSOURCES</div><h2>Liens du projet</h2>{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</section>}
            </div>
        </main>
    );
}

export default ProjectDetails;
