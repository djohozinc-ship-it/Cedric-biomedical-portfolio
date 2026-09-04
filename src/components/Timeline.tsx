import React from 'react';
import '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss';

function Timeline() {
  return (
    <div id="history">
      <div className="items-container">
        <h1>Parcours</h1>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid white' }}
            date="23/03/2026 - 12/06/2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Stagiaire — Centre Hospitalier Départemental du Zou</h3>
            <h4 className="vertical-timeline-element-subtitle">Direction des Équipements et de la Maintenance</h4>
            <p>
              Participation aux activités de maintenance préventive et corrective, au diagnostic et à la recherche de pannes,
              à l’installation de dispositifs médicaux, à l’inventaire et aux tests de fonctionnement des équipements, ainsi
              qu’au montage et à l’installation d’échographes EDAN AX3 et au suivi des activités de maintenance.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="12/08/2025 - 06/09/2025"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Stagiaire — Centre Hospitalier Départemental du Zou</h3>
            <h4 className="vertical-timeline-element-subtitle">Maintenance biomédicale et hospitalière</h4>
            <p>
              Participation aux interventions de maintenance et à l’installation de dispositifs médicaux, découverte
              de l’environnement hospitalier et participation aux activités administratives liées à la maintenance.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="12/08/2024 - 06/09/2024"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Stagiaire — Hôpital de Zone de Covè</h3>
            <h4 className="vertical-timeline-element-subtitle">Maintenance technique</h4>
            <p>
              Participation aux activités de maintenance préventive et corrective et à l’installation de dispositifs médicaux.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="25/07/2022 - 01/09/2022"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Stagiaire — SERIB</h3>
            <h4 className="vertical-timeline-element-subtitle">Service de Rembobinage Industriel et de Bâtiment</h4>
            <p>
              Montage et démontage de moteurs électriques, entretien des moteurs et initiation aux opérations de rembobinage.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">Licence professionnelle en Maintenance Biomédicale et Hospitalière</h3>
            <h4 className="vertical-timeline-element-subtitle">École Polytechnique d’Abomey-Calavi (EPAC)</h4>
            <p>
              Formation en maintenance biomédicale et hospitalière, dispositifs médicaux, diagnostic, installation et suivi des équipements de santé.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">Baccalauréat Technique — Électrotechnique</h3>
            <h4 className="vertical-timeline-element-subtitle">Lycée Technique et Professionnel de Porto-Novo</h4>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">Diplôme du Technicien Industriel (DTI) — Électrotechnique</h3>
            <h4 className="vertical-timeline-element-subtitle">Lycée Technique et Professionnel de Porto-Novo</h4>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2022"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">Certificat d’Aptitude Professionnelle (CAP) — Électricité</h3>
            <h4 className="vertical-timeline-element-subtitle">Lycée Technique et Professionnel de Porto-Novo</h4>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2021"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">Formation en Électronique et Électrotechnique</h3>
            <h4 className="vertical-timeline-element-subtitle">CFREE — Bohicon</h4>
            <p>
              Câblage et maintenance électriques, moteurs triphasés, systèmes photovoltaïques et antennes paraboliques.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;
