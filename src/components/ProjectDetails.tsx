import React, { useEffect, useMemo, useState } from "react";
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCodeBranch, faImages, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/ProjectDetails.scss';

type ProjectData = {
    slug: string;
    title: string;
    category: string;
    summary: string;
    description: string;
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
        description: 'SACRURO est un projet de conception biomédicale et environnementale visant à récupérer le concentrat d’osmose inverse produit par les unités de dialyse afin de le valoriser pour des usages non potables. Le système associe automatisation, instrumentation, supervision locale et communication IoT.',
        role: 'Conception du système, électronique, firmware, logique de contrôle et développement de l’interface mobile.',
        technologies: ['ESP32', 'C/C++', 'ADS1115', 'MCP23017', 'MQTT', 'React Native', 'Expo', 'Capteurs', 'Électrovannes', 'Pompes'],
        features: ['Mesure et acquisition des paramètres', 'Commande des pompes et électrovannes', 'Communication MQTT', 'Mode local avec point d’accès ESP32', 'Supervision depuis une application mobile', 'Surveillance par watchdog'],
        links: []
    },
    {
        slug: 'gmao-hospitaliere',
        title: 'GMAO hospitalière open source',
        category: 'Génie biomédical · Logiciel',
        summary: 'Concept de plateforme locale de gestion de maintenance pour les techniciens biomédicaux hospitaliers.',
        description: 'Une solution pensée pour centraliser les équipements, interventions, maintenances préventives et correctives, historiques et informations techniques dans un environnement hospitalier.',
        role: 'Conception fonctionnelle et développement du concept logiciel.',
        technologies: ['Web', 'Base de données', 'Maintenance biomédicale', 'IoT'],
        features: ['Inventaire des équipements', 'Suivi des interventions', 'Maintenance préventive', 'Historique des pannes', 'Traçabilité des opérations']
    },
    {
        slug: 'carte-donnees-biomedicales',
        title: 'Carte universelle de données biomédicales',
        category: 'Électronique · Instrumentation biomédicale',
        summary: 'Architecture électronique destinée à faciliter l’acquisition et l’intégration de données issues de capteurs biomédicaux.',
        description: 'Projet d’architecture électronique modulaire destiné à connecter différents capteurs et interfaces d’acquisition à un système de traitement ou de supervision.',
        role: 'Conception de l’architecture et étude de l’intégration des différents modules.',
        technologies: ['ESP32', 'ADC', 'ADS1115', 'Capteurs', 'Électronique analogique', 'Électronique numérique', 'KiCad'],
        features: ['Acquisition analogique', 'Interfaces capteurs', 'Traitement embarqué', 'Architecture modulaire', 'Communication avec système de supervision']
    },
    {
        slug: 'ppg-computer-vision',
        title: 'Estimation du rythme cardiaque par PPG et vision par ordinateur',
        category: 'IA · Computer Vision · Santé',
        summary: 'Exploration de l’estimation de paramètres physiologiques à partir de signaux vidéo.',
        description: 'Projet exploratoire autour de l’analyse vidéo et de la photopléthysmographie à distance pour estimer le rythme cardiaque. L’approche utilise le traitement d’image et le suivi de zones du visage.',
        role: 'Développement et expérimentation de la chaîne de traitement.',
        technologies: ['Python', 'OpenCV', 'MediaPipe', 'Traitement du signal', 'Computer Vision'],
        features: ['Détection et suivi du visage', 'Extraction de variations photométriques', 'Traitement du signal', 'Estimation du rythme cardiaque']
    },
    {
        slug: 'medura',
        title: 'Medura',
        category: 'Technologie médicale · Application',
        summary: 'Concept de solution numérique orientée vers l’assistance et l’accès à l’information de santé.',
        description: 'Medura explore l’utilisation du numérique pour améliorer l’accès à certaines informations et fonctionnalités d’assistance dans le domaine de la santé.',
        role: 'Conception et développement du prototype.',
        technologies: ['React', 'TypeScript', 'Application web', 'UX/UI'],
        features: ['Interface utilisateur', 'Organisation de l’information', 'Architecture modulaire']
    },
    {
        slug: 'moyes-pro',
        title: 'Moyes Pro',
        category: 'Dispositif d’assistance · Prototypage',
        summary: 'Projet de technologie d’assistance visant à répondre à un besoin fonctionnel par une solution technique.',
        description: 'Projet orienté conception et prototypage d’une solution d’assistance, avec une approche centrée sur le besoin de l’utilisateur et l’intégration de technologies électroniques.',
        role: 'Conception, prototypage et intégration technique.',
        technologies: ['Électronique', 'Microcontrôleurs', 'Prototypage', 'Conception de dispositif'],
        features: ['Analyse du besoin', 'Conception du prototype', 'Intégration électronique', 'Validation fonctionnelle']
    },
    {
        slug: 'thermostat-solidworks',
        title: 'Thermostat – conception CAO',
        category: 'Conception mécanique · CAO',
        summary: 'Conception et modélisation d’un thermostat avec approche de conception assistée par ordinateur.',
        description: 'Projet de modélisation mécanique réalisé dans une démarche de conception assistée par ordinateur, avec attention portée à la géométrie et à l’intégration des composants.',
        role: 'Modélisation et conception du prototype.',
        technologies: ['SolidWorks', 'CAO', 'Conception mécanique'],
        features: ['Modélisation 3D', 'Assemblage', 'Étude de l’intégration']
    },
    {
        slug: 'gbm-learn',
        title: 'GBM Learn',
        category: 'Éducation · Génie biomédical',
        summary: 'Projet numérique destiné à faciliter l’apprentissage et le partage de connaissances en génie biomédical.',
        description: 'GBM Learn s’inscrit dans une démarche de vulgarisation et de partage de ressources autour du génie biomédical et des technologies médicales.',
        role: 'Conception du concept et développement de la plateforme.',
        technologies: ['Web', 'TypeScript', 'React'],
        features: ['Organisation de ressources', 'Interface pédagogique', 'Contenus orientés génie biomédical']
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
        return (
            <main className="project-details-page">
                <button className="project-back" onClick={() => { window.location.hash = '#projects'; }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
                </button>
                <div className="project-not-found">
                    <h1>Projet introuvable</h1>
                    <p>Ce projet n’existe pas ou son identifiant a changé.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="project-details-page">
            <button className="project-back" onClick={() => { window.location.hash = '#projects'; }}>
                <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
            </button>

            <header className="project-details-hero">
                <span className="project-category">{project.category}</span>
                <h1>{project.title}</h1>
                <p className="project-lead">{project.summary}</p>
            </header>

            <section className="project-details-section project-description">
                <h2>À propos du projet</h2>
                <p>{project.description}</p>
                <p><strong>Mon rôle :</strong> {project.role}</p>
            </section>

            <section className="project-details-section">
                <h2><FontAwesomeIcon icon={faCodeBranch} /> Technologies utilisées</h2>
                <div className="project-chips">
                    {project.technologies.map((technology) => <Chip key={technology} label={technology} />)}
                </div>
            </section>

            <section className="project-details-section">
                <h2>Fonctionnalités & points clés</h2>
                <ul className="project-features">
                    {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
            </section>

            <section className="project-details-section project-media-section">
                <h2><FontAwesomeIcon icon={faImages} /> Galerie & démonstration</h2>
                {project.media?.length ? (
                    <div className="project-media-grid">
                        {project.media.map((item) => item.type === 'video' ? (
                            <video key={item.src} controls preload="metadata" src={item.src} aria-label={item.alt} />
                        ) : (
                            <img key={item.src} src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                        ))}
                    </div>
                ) : (
                    <div className="project-media-placeholder">
                        <FontAwesomeIcon icon={faPlayCircle} size="2x" />
                        <h3>Démonstrations à venir</h3>
                        <p>Les photos, captures d’écran et vidéos réelles du projet seront ajoutées ici.</p>
                    </div>
                )}
            </section>

            {!!project.links?.length && (
                <section className="project-details-section project-links">
                    <h2>Liens</h2>
                    {project.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}
                </section>
            )}
        </main>
    );
}

export default ProjectDetails;
