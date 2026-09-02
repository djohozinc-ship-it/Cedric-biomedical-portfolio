import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faStethoscope, faCode } from '@fortawesome/free-solid-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const biomedicalSkills = [
    "Maintenance biomédicale",
    "Dispositifs médicaux",
    "Diagnostic & dépannage",
    "Sécurité des équipements",
    "Prototypage",
    "Conception de solutions de santé"
];

const electronicsSkills = [
    "ESP32",
    "Arduino",
    "Électronique analogique",
    "Électronique numérique",
    "Capteurs",
    "ADS1115",
    "MCP23017",
    "KiCad",
    "SolidWorks"
];

const softwareSkills = [
    "C/C++",
    "TypeScript",
    "React",
    "React Native",
    "Expo",
    "MQTT",
    "OpenCV",
    "MediaPipe",
    "Docker",
    "Linux"
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faStethoscope} size="3x"/>
                    <h3>Ingénierie biomédicale</h3>
                    <p>Formation en génie biomédical orientée vers la maintenance des équipements hospitaliers, la conception de dispositifs médicaux et le développement de solutions techniques adaptées aux besoins du secteur de la santé.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Domaines :</span>
                        {biomedicalSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faMicrochip} size="3x"/>
                    <h3>Électronique & systèmes embarqués</h3>
                    <p>Conception et prototypage de systèmes électroniques pour la santé : acquisition de données, capteurs, commande, communication et intégration de microcontrôleurs dans des solutions embarquées.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Technologies :</span>
                        {electronicsSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faCode} size="3x"/>
                    <h3>Logiciel, IoT & technologies de santé</h3>
                    <p>Développement d'applications et de systèmes connectés pour compléter les dispositifs biomédicaux, avec un intérêt particulier pour l'IoT, l'analyse de signaux et l'intelligence artificielle appliquée à la santé.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Technologies :</span>
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