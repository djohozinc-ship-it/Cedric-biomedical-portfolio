import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Project.scss';

type ProjectCard = {
    slug: string;
    title: string;
    summary: string;
};

// Keep only lightweight card data in the main bundle.
// Full project details are loaded only when a project is opened.
const projectCards: ProjectCard[] = [
    {
        slug: 'sacruro',
        title: 'SACRURO',
        summary: 'Projet de récupération et de valorisation du concentrat rejeté par les unités de dialyse pour des usages non potables.'
    },
    {
        slug: 'carte-donnees-biomedicales',
        title: 'Carte universelle de données biomédicales',
        summary: 'Étude d’une carte électronique modulaire pour l’acquisition et l’intégration de données provenant de différents capteurs.'
    },
    {
        slug: 'ppg-computer-vision',
        title: 'Estimation du rythme cardiaque par PPG et vision par ordinateur',
        summary: 'Expérimentation d’une méthode sans contact pour estimer le rythme cardiaque à partir d’une vidéo.'
    },
    {
        slug: 'moyes-pro',
        title: 'Moyes Pro',
        summary: 'Projet de dispositif d’assistance développé autour d’un besoin fonctionnel et d’une approche de prototypage électronique.'
    },
    {
        slug: 'gmao-hospitaliere',
        title: 'GMAO hospitalière open source',
        summary: 'Concept d’une plateforme locale de gestion de maintenance destinée aux techniciens biomédicaux hospitaliers.'
    },
    {
        slug: 'medura',
        title: 'Medura',
        summary: 'Prototype numérique orienté vers l’assistance et l’organisation de l’information dans le domaine de la santé.'
    },
    {
        slug: 'gbm-learn',
        title: 'GBM Learn',
        summary: 'Projet numérique destiné à structurer des ressources d’apprentissage autour du génie biomédical.'
    },
    {
        slug: 'thermostat-solidworks',
        title: 'Thermostat – conception CAO',
        summary: 'Modélisation d’un thermostat dans le cadre d’un exercice de conception assistée par ordinateur.'
    },
    {
        slug: 'arduino-jump-game',
        title: 'Arduino Jump Game',
        summary: 'Petit projet embarqué réalisé autour d’Arduino pour expérimenter les entrées, sorties et la logique de jeu.'
    },
    {
        slug: 'blender-tower',
        title: 'Blender Tower',
        summary: 'Projet de modélisation 3D réalisé avec Blender pour explorer la conception et la représentation d’un environnement architectural.'
    }
];

function Project() {
    useEffect(() => {
        const savedPosition = sessionStorage.getItem('projects-scroll-position');
        if (savedPosition === null) return;

        const position = Number(savedPosition);
        if (!Number.isFinite(position)) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: position, left: 0, behavior: 'auto' });
                sessionStorage.removeItem('projects-scroll-position');
            });
        });
    }, []);

    const openProject = (slug: string) => {
        sessionStorage.setItem('projects-scroll-position', String(window.scrollY));
        window.location.hash = `#/project/${slug}`;
    };

    return(
    <div className="projects-container" id="projects">
        <h1>Projects</h1>
        <div className="projects-grid">
            {projectCards.map((project) => (
                <article className="project" key={project.slug}>
                    <button type="button" className="project-visual" aria-label={`Voir le projet ${project.title}`} onClick={() => openProject(project.slug)}>
                        <span>{project.title}</span>
                    </button>
                    <button type="button" className="project-title-button" onClick={() => openProject(project.slug)}><h2>{project.title}</h2></button>
                    <p>{project.summary}</p>
                    <button type="button" className="project-details-link" onClick={() => openProject(project.slug)}>
                        Voir le projet <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </article>
            ))}
        </div>
    </div>
    );
}

export default Project;
