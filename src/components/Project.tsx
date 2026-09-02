import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { projects } from './ProjectDetails';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Projects</h1>
        <div className="projects-grid">
            {projects.map((project) => (
                <article className="project" key={project.slug}>
                    <a href={`#/project/${project.slug}`} className="project-visual" aria-label={`Voir le projet ${project.title}`}>
                        <span>{project.title}</span>
                    </a>
                    <a href={`#/project/${project.slug}`}><h2>{project.title}</h2></a>
                    <p>{project.summary}</p>
                    <a className="project-details-link" href={`#/project/${project.slug}`}>
                        Voir le projet <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                </article>
            ))}
        </div>
    </div>
    );
}

export default Project;
