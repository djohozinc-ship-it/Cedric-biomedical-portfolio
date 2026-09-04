import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Project.scss';

type ProjectCard = { slug: string; title: string; summary: string; image: string };

const projectCards: ProjectCard[] = [
    { slug: 'sacruro', title: 'SACRURO', summary: 'Projet de récupération et de valorisation du concentrat rejeté par les unités de dialyse pour des usages non potables.', image: `${process.env.PUBLIC_URL}/images/projects/sacruro.svg` },
    { slug: 'carte-donnees-biomedicales', title: 'Carte universelle de données biomédicales', summary: 'Étude d’une carte électronique modulaire pour l’acquisition et l’intégration de données provenant de différents capteurs.', image: `${process.env.PUBLIC_URL}/images/projects/carte-donnees-biomedicales.svg` },
    { slug: 'ppg-computer-vision', title: 'Estimation du rythme cardiaque par PPG et vision par ordinateur', summary: 'Expérimentation d’une méthode sans contact pour estimer le rythme cardiaque à partir d’une vidéo.', image: `${process.env.PUBLIC_URL}/images/projects/ppg-computer-vision.svg` },
    { slug: 'mor-eyes', title: 'MOR-EYES COM V1.0', summary: 'Système de suppléance oratoire assisté par vision artificielle pour transformer des clignements volontaires en commandes et en parole.', image: `${process.env.PUBLIC_URL}/images/projects/mor-eyes.svg` },
    { slug: 'moyes-pro', title: 'Moyes Pro', summary: 'Projet de dispositif d’assistance développé autour d’un besoin fonctionnel et d’une approche de prototypage électronique.', image: `${process.env.PUBLIC_URL}/images/projects/moyes-pro.svg` },
    { slug: 'gmao-hospitaliere', title: 'GMAO hospitalière à code source ouvert', summary: 'Concept d’une plateforme locale de gestion de maintenance destinée aux techniciens biomédicaux hospitaliers.', image: `${process.env.PUBLIC_URL}/images/projects/gmao-hospitaliere.svg` },
    { slug: 'medura', title: 'Medura', summary: 'Prototype numérique orienté vers l’assistance et l’organisation de l’information dans le domaine de la santé.', image: `${process.env.PUBLIC_URL}/images/projects/medura.svg` },
    { slug: 'gbm-learn', title: 'GBM Learn', summary: 'Projet numérique destiné à structurer des ressources d’apprentissage autour du génie biomédical.', image: `${process.env.PUBLIC_URL}/images/projects/gbm-learn.svg` },
    { slug: 'thermostat-solidworks', title: 'Thermostat – conception CAO', summary: 'Modélisation d’un thermostat dans le cadre d’un exercice de conception assistée par ordinateur.', image: `${process.env.PUBLIC_URL}/images/projects/thermostat-solidworks.svg` },
    { slug: 'arduino-jump-game', title: 'Jeu de saut Arduino', summary: 'Petit projet embarqué réalisé autour d’Arduino pour expérimenter les entrées, les sorties et la logique de jeu.', image: `${process.env.PUBLIC_URL}/images/projects/arduino-jump-game.svg` },
    { slug: 'blender-tower', title: 'Tour modélisée avec Blender', summary: 'Projet de modélisation 3D réalisé avec Blender pour explorer la conception et la représentation d’un environnement architectural.', image: `${process.env.PUBLIC_URL}/images/projects/blender-tower.svg` }
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

    return (
        <div className="projects-container" id="projects">
            <div className="projects-heading">
                <div>
                    <span className="projects-kicker">SÉLECTION DE PROJETS</span>
                    <h1>Projets</h1>
                </div>
                <p className="projects-heading-note">Conception biomédicale · électronique · automatisation · logiciel</p>
            </div>
            <div className="projects-grid">
                {projectCards.map((project, index) => (
                    <article className="project" key={project.slug} style={{ '--project-index': index } as React.CSSProperties}>
                        <button type="button" className="project-visual" aria-label={`Voir le projet ${project.title}`} onClick={() => openProject(project.slug)} style={{ backgroundImage: `url("${project.image}")` }}>
                            <span className="project-visual-shine" aria-hidden="true" />
                            <span className="project-visual-label">{String(index + 1).padStart(2, '0')}</span>
                            <span className="project-visual-title">{project.title}</span>
                            <span className="project-visual-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></span>
                        </button>
                        <button type="button" className="project-title-button" onClick={() => openProject(project.slug)}><h2>{project.title}</h2></button>
                        <p>{project.summary}</p>
                        <button type="button" className="project-details-link" onClick={() => openProject(project.slug)}>
                            Découvrir le projet <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Project;
