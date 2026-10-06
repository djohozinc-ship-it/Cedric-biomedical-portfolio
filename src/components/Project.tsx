import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import osmoseurImage from '../assets/images/sacruro/chd-zou-osmoseur.jpg';
import '../assets/styles/Project.scss';

const publicUrl = process.env.PUBLIC_URL || '';

type FeaturedProject = {
    slug: string;
    title: string;
    summary: string;
    image: string;
    alt: string;
    width: number;
    height: number;
    facts: { label: string; value: string }[];
};

type ShortProject = { slug: string; title: string; summary: string; tags: string };

// Les trois projets documentés en détail : photo réelle + fiche (domaine, statut, technologies).
const featuredProjects: FeaturedProject[] = [
    {
        slug: 'sacruro',
        title: 'SACRURO',
        summary: 'Récupérer et valoriser le concentrat rejeté par l’osmoseur d’une unité de dialyse, pour des usages non potables.',
        image: osmoseurImage,
        alt: 'Osmoseur et cuves de traitement d’eau de l’unité de dialyse du CHD-Zou',
        width: 1800,
        height: 1350,
        facts: [
            { label: 'Domaine', value: 'Génie biomédical, IoT, gestion de l’eau' },
            { label: 'Statut', value: 'Mémoire en binôme : étude de conception et prototype de supervision' },
            { label: 'Technologies', value: 'ESP32, MQTT, React Native, KiCad' }
        ]
    },
    {
        slug: 'mor-eyes',
        title: 'MOR-EYES COM V1.0',
        summary: 'Un système de suppléance oratoire : la vision artificielle transforme des clignements volontaires en commandes, puis en parole.',
        image: `${publicUrl}/images/projects/mor-eyes/hero.jpg`,
        alt: 'Prototype MOR-EYES devant l’interface du logiciel de communication',
        width: 1080,
        height: 797,
        facts: [
            { label: 'Domaine', value: 'Technologie d’assistance' },
            { label: 'Statut', value: 'Prototype fonctionnel V1.0' },
            { label: 'Technologies', value: 'Python, OpenCV, MediaPipe, pyttsx3' }
        ]
    },
    {
        slug: 'ppg-computer-vision',
        title: 'Rythme cardiaque par PPG et vision par ordinateur',
        summary: 'Une méthode sans contact pour estimer le rythme cardiaque à partir d’une vidéo du visage.',
        image: `${publicUrl}/images/projects/ppg/signal-ppg-brut.png`,
        alt: 'Capture de l’expérimentation : zone du visage analysée et signal PPG brut',
        width: 1920,
        height: 1080,
        facts: [
            { label: 'Domaine', value: 'Traitement du signal, santé' },
            { label: 'Statut', value: 'Expérimentation' },
            { label: 'Technologies', value: 'Python, OpenCV, MediaPipe' }
        ]
    }
];

const shortProjects: ShortProject[] = [
    { slug: 'medura', title: 'Medura', summary: 'Prototype numérique pour organiser l’information et assister dans le domaine de la santé.', tags: 'React, TypeScript' },
    { slug: 'gbm-learn', title: 'GBM Learn', summary: 'Ressources d’apprentissage structurées autour du génie biomédical.', tags: 'React, TypeScript' },
    { slug: 'arduino-jump-game', title: 'Jeu de saut Arduino', summary: 'Un petit jeu embarqué pour pratiquer les entrées, les sorties et la logique de jeu.', tags: 'Arduino, C/C++, électronique' },
    { slug: 'blender-tower', title: 'Tour modélisée avec Blender', summary: 'Modélisation 3D d’une structure architecturale.', tags: 'Blender, modélisation 3D' }
];

function Project() {
    useEffect(() => {
        let savedPosition: string | null = null;
        try { savedPosition = sessionStorage.getItem('projects-scroll-position'); } catch { /* stockage indisponible */ }
        if (savedPosition === null) return;
        const position = Number(savedPosition);
        if (!Number.isFinite(position)) return;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: position, left: 0, behavior: 'auto' });
                try { sessionStorage.removeItem('projects-scroll-position'); } catch { /* ignore */ }
            });
        });
    }, []);

    // On mémorise la position pour la retrouver au retour depuis la fiche.
    const rememberPosition = () => {
        try { sessionStorage.setItem('projects-scroll-position', String(window.scrollY)); } catch { /* ignore */ }
    };

    const renderFeatured = (project: FeaturedProject, className: string) => (
        <article className={`pj-card ${className}`} key={project.slug}>
            <div className="pj-media">
                <img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" decoding="async" />
            </div>
            <div className="pj-body">
                <h2 className="pj-title">
                    <a href={`#/project/${project.slug}`} onClick={rememberPosition}>{project.title}</a>
                </h2>
                <p className="pj-summary">{project.summary}</p>
                <dl className="pj-facts">
                    {project.facts.map((fact) => (
                        <div key={fact.label}>
                            <dt>{fact.label}</dt>
                            <dd>{fact.value}</dd>
                        </div>
                    ))}
                </dl>
                <span className="pj-cta" aria-hidden="true">Voir le projet</span>
            </div>
        </article>
    );

    return (
        <div className="projects-container" id="projects">
            <header className="projects-heading">
                <h1>Projets</h1>
                <p>Trois projets présentés en détail, puis des réalisations plus courtes.</p>
            </header>

            {renderFeatured(featuredProjects[0], 'pj-feature')}

            <div className="pj-pair">
                {featuredProjects.slice(1).map((project) => renderFeatured(project, 'pj-secondary'))}
            </div>

            <section className="pj-more" aria-labelledby="pj-more-title">
                <h2 id="pj-more-title">Autres réalisations</h2>
                <ul>
                    {shortProjects.map((project) => (
                        <li key={project.slug}>
                            <a className="pj-row" href={`#/project/${project.slug}`} onClick={rememberPosition}>
                                <span className="pj-row-title">{project.title}</span>
                                <span className="pj-row-summary">{project.summary}</span>
                                <span className="pj-row-tags">{project.tags}</span>
                                <FontAwesomeIcon className="pj-row-icon" icon={faChevronRight} aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Project;
