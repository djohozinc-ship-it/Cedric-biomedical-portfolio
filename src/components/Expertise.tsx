import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faStethoscope, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const biomedicalSkills = [
    "Maintenance préventive",
    "Maintenance corrective",
    "Diagnostic et recherche de pannes",
    "Installation de dispositifs médicaux",
    "Mise en service",
    "Suivi des équipements hospitaliers",
    "Maintenance niveau 1",
    "Inventaire et tests de fonctionnement"
];

const electronicsSkills = [
    "Électronique",
    "Électrotechnique",
    "Câblage industriel",
    "Conception de schémas électroniques",
    "Réalisation de PCB",
    "Moteurs électriques",
    "Systèmes photovoltaïques"
];

const tools = [
    "KiCad",
    "SolidWorks",
    "Arduino IDE",
    "VS Code"
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faStethoscope} size="3x"/>
                    <h3>Maintenance biomédicale</h3>
                    <p>
                        Compétences pratiques développées au cours de ma formation et de mes stages en milieu hospitalier.
                        Intervention sur les équipements sous encadrement, avec une approche orientée diagnostic, maintenance et sécurité.
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">Compétences :</span>
                        {biomedicalSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faMicrochip} size="3x"/>
                    <h3>Électronique & électrotechnique</h3>
                    <p>
                        Base technique acquise en électrotechnique et en électronique, complétée par la pratique du câblage,
                        des moteurs électriques et de la conception de systèmes électroniques.
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">Compétences :</span>
                        {electronicsSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faScrewdriverWrench} size="3x"/>
                    <h3>Conception & prototypage</h3>
                    <p>
                        Réalisation de prototypes dans le cadre de projets académiques et personnels, en combinant électronique,
                        systèmes embarqués et programmation. Niveau orienté apprentissage et développement de prototypes fonctionnels.
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">Outils maîtrisés :</span>
                        {tools.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;