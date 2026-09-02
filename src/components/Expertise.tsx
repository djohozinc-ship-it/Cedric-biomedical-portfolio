import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faStethoscope, faCode } from '@fortawesome/free-solid-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const biomedicalSkills = [
    "Maintenance préventive et corrective",
    "Équipements biomédicaux",
    "Diagnostic et recherche de pannes",
    "Installation et mise en service",
    "Suivi des équipements hospitaliers",
    "Dispositifs médicaux",
    "Maintenance niveau 1",
    "Environnement hospitalier"
];

const electronicsSkills = [
    "Câblage industriel",
    "Conception de schémas électroniques",
    "Réalisation de PCB",
    "Technologies embarquées",
    "Électronique & électrotechnique",
    "Moteurs triphasés",
    "Systèmes photovoltaïques"
];

const softwareSkills = [
    "KiCad",
    "SolidWorks",
    "Arduino IDE",
    "VS Code",
    "Prototypage technologique",
    "Vision artificielle"
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
                    <p>Formation et expérience pratique dans la maintenance des équipements biomédicaux et hospitaliers, le diagnostic, l'installation et le suivi des dispositifs médicaux.</p>
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
                    <p>Compétences acquises en électrotechnique, électronique et réalisation de systèmes techniques, avec une orientation vers les technologies embarquées et les solutions biomédicales.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Domaines :</span>
                        {electronicsSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faCode} size="3x"/>
                    <h3>Conception & prototypage</h3>
                    <p>Réalisation de prototypes technologiques combinant électronique, systèmes embarqués et outils numériques pour répondre à des problématiques concrètes, notamment dans le domaine de la santé.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Outils & approches :</span>
                        {softwareSkills.map((label, index) => (
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