import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { projects } from './ProjectDetails';
import '../assets/styles/Project.scss';

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
            {projects.map((project) => (
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
