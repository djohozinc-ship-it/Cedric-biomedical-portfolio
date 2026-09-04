import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faEye,
    faMicrophone,
    faCamera,
    faBrain,
    faCode,
    faDatabase,
    faMicrochip,
    faPlayCircle,
    faImages,
} from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/MorEyesDetails.scss';

const publicUrl = process.env.PUBLIC_URL || '';

const gallery = [
    { src: `${publicUrl}/images/projects/mor-eyes/photo-1.jpg`, alt: 'MOR-EYES — prototype, vue 1' },
    { src: `${publicUrl}/images/projects/mor-eyes/photo-2.jpg`, alt: 'MOR-EYES — prototype, vue 2' },
    { src: `${publicUrl}/images/projects/mor-eyes/photo-3.jpg`, alt: 'MOR-EYES — interface et dispositif' },
    { src: `${publicUrl}/images/projects/mor-eyes/photo-4.jpg`, alt: 'MOR-EYES — électronique du prototype' },
    { src: `${publicUrl}/images/projects/mor-eyes/photo-5.jpg`, alt: 'MOR-EYES — système en fonctionnement' },
    { src: `${publicUrl}/images/projects/mor-eyes/photo-6.jpg`, alt: 'MOR-EYES — démonstration du prototype' },
];

const pipeline = [
    {
        icon: faCamera,
        title: '1. Acquisition visuelle',
        text: 'Une caméra standard, positionnée face au patient, capture le flux vidéo en temps réel et transmet les images au module de traitement.',
    },
    {
        icon: faEye,
        title: '2. Détection oculomotrice',
        text: 'Le système localise la région oculaire, analyse l’état ouvert ou fermé des paupières et mesure la durée des clignements.',
    },
    {
        icon: faBrain,
        title: '3. Interprétation du signal',
        text: 'Les clignements sont transformés en commandes numériques. La V1.0 exploite notamment un mode de balayage automatique et un mode inspiré du code Morse.',
    },
    {
        icon: faMicrophone,
        title: '4. Restitution vocale',
        text: 'Le message texte final est transmis à un module Text-To-Speech pour produire immédiatement une voix claire et intelligible.',
    },
];

const libraries = [
    { name: 'MediaPipe', role: 'Suivi des points faciaux et extraction des landmarks oculaires.' },
    { name: 'OpenCV', role: 'Capture vidéo, traitement d’image et gestion du pipeline visuel.' },
    { name: 'pyttsx3', role: 'Synthèse vocale hors ligne et lecture instantanée des messages.' },
    { name: 'CustomTkinter', role: 'Création de l’interface graphique et gestion des menus.' },
    { name: 'SQLite3', role: 'Stockage local des phrases rapides, de l’historique et des paramètres.' },
];

function MorEyesDetails() {
    return (
        <main className="mor-eyes-page">
            <section className="mor-eyes-hero">
                <div className="mor-eyes-hero-inner">
                    <button type="button" className="mor-eyes-back" onClick={() => { window.location.hash = ''; }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
                    </button>
                    <div className="mor-eyes-kicker">SECTEUR BIOMÉDICAL · V1.0</div>
                    <h1>MOR-EYES COM</h1>
                    <p className="mor-eyes-tagline">Système de suppléance oratoire assisté par vision artificielle.</p>
                    <p className="mor-eyes-authors">Cédric DJOHOZIN · Caleb HOUNYO · Smiss Dossou LAWISSA</p>
                    <div className="mor-eyes-actions">
                        <a href="#mor-eyes-pipeline"><FontAwesomeIcon icon={faEye} /> Voir le fonctionnement</a>
                        <a href="#mor-eyes-gallery"><FontAwesomeIcon icon={faImages} /> Galerie</a>
                    </div>
                </div>
            </section>

            <section className="mor-eyes-section mor-eyes-intro">
                <div className="mor-eyes-section-heading">
                    <span>01</span>
                    <h2>Constat et problématique</h2>
                </div>
                <div className="mor-eyes-two-column">
                    <div>
                        <p>L’aphasie peut priver une personne de sa capacité à communiquer oralement, notamment après un AVC. Dans les situations de paralysie sévère, la conscience et le besoin de communiquer peuvent rester présents alors que les moyens d’expression sont fortement limités.</p>
                        <p>Le projet part d’un constat simple présenté dans la V1.0 : lorsque les mouvements oculaires et palpébraux restent disponibles, le regard et le clignement peuvent constituer un canal volontaire de communication.</p>
                    </div>
                    <div className="mor-eyes-callout">
                        <span className="mor-eyes-callout-label">Objectif</span>
                        <strong>Transformer des actions oculaires volontaires en commandes compréhensibles puis en parole.</strong>
                    </div>
                </div>
            </section>

            <section className="mor-eyes-section">
                <div className="mor-eyes-section-heading">
                    <span>02</span>
                    <h2>Rappel du projet</h2>
                </div>
                <div className="mor-eyes-pillar-grid">
                    <article><FontAwesomeIcon icon={faEye} /><h3>Détection oculaire</h3><p>Vision par ordinateur pour observer le regard et les paupières.</p></article>
                    <article><FontAwesomeIcon icon={faBrain} /><h3>Interprétation du signal</h3><p>Conversion des séquences de clignements en commandes numériques.</p></article>
                    <article><FontAwesomeIcon icon={faMicrophone} /><h3>Synthèse vocale</h3><p>Transformation du message sélectionné en parole instantanée.</p></article>
                </div>
            </section>

            <section className="mor-eyes-section mor-eyes-anatomy">
                <div className="mor-eyes-section-heading">
                    <span>03</span>
                    <h2>Constat anatomique</h2>
                </div>
                <p>La V1.0 s’appuie sur l’observation que, chez de nombreux patients aphasiques ou présentant une paralysie sévère, la motricité oculaire et palpébrale peut rester préservée. Le projet met ainsi à profit les mouvements des yeux et des paupières comme voie de communication volontaire.</p>
                <div className="mor-eyes-neuro-grid">
                    <div><strong>III · IV · VI</strong><span>Nerfs crâniens associés aux muscles oculomoteurs</span></div>
                    <div><strong>VII</strong><span>Nerf crânien impliqué dans la motricité des paupières</span></div>
                    <div><strong>Regard + clignement</strong><span>Canal de communication exploité par le système</span></div>
                </div>
            </section>

            <section id="mor-eyes-pipeline" className="mor-eyes-section">
                <div className="mor-eyes-section-heading">
                    <span>04</span>
                    <h2>Fonctionnement du système</h2>
                </div>
                <p className="mor-eyes-section-lead">L’architecture V1.0 est organisée en quatre étapes : acquisition, détection, interprétation et restitution vocale.</p>
                <div className="mor-eyes-pipeline">
                    {pipeline.map((item) => (
                        <article key={item.title}>
                            <div className="mor-eyes-pipeline-icon"><FontAwesomeIcon icon={item.icon} /></div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
                <div className="mor-eyes-blink-codes">
                    <div><strong>Clignement court</strong><span>Commande simple</span></div>
                    <div><strong>Clignement long</strong><span>Validation</span></div>
                    <div><strong>Double clignement</strong><span>Action spécifique</span></div>
                </div>
            </section>

            <section className="mor-eyes-section">
                <div className="mor-eyes-section-heading">
                    <span>05</span>
                    <h2>Librairies utilisées</h2>
                </div>
                <div className="mor-eyes-library-grid">
                    {libraries.map((library) => (
                        <article key={library.name}>
                            <FontAwesomeIcon icon={faCode} />
                            <h3>{library.name}</h3>
                            <p>{library.role}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mor-eyes-section mor-eyes-electronics">
                <div className="mor-eyes-section-heading">
                    <span>06</span>
                    <h2>Aspect électronique</h2>
                </div>
                <p>La présentation V1.0 montre également un principe électronique simple articulé autour d’une LED et d’une LDR, en complément de la chaîne logicielle de vision et d’interface.</p>
                <div className="mor-eyes-electronics-diagram">
                    <div><FontAwesomeIcon icon={faMicrochip} /><strong>LED</strong><span>Émission lumineuse</span></div>
                    <span className="mor-eyes-line" aria-hidden="true" />
                    <div><FontAwesomeIcon icon={faMicrochip} /><strong>LDR</strong><span>Détection lumineuse</span></div>
                </div>
            </section>

            <section className="mor-eyes-section">
                <div className="mor-eyes-section-heading">
                    <span>07</span>
                    <h2>Usage de l’interface</h2>
                </div>
                <div className="mor-eyes-interface-box">
                    <FontAwesomeIcon icon={faDatabase} />
                    <div>
                        <p>L’interface Mor-Eyes Pro V1.0 nécessite une formation préalable, mais elle a été pensée pour rester facile à utiliser et intuitive. La présentation indique qu’une prise en main peut être acquise par les médecins, infirmiers et techniciens avec peu de temps et d’effort.</p>
                        <div className="mor-eyes-interface-tags"><span>Morse</span><span>Phrases rapides</span><span>Historique local</span><span>Interaction patient-machine</span></div>
                    </div>
                </div>
            </section>

            <section id="mor-eyes-gallery" className="mor-eyes-section mor-eyes-gallery-section">
                <div className="mor-eyes-section-heading">
                    <span>08</span>
                    <h2>Galerie du prototype</h2>
                </div>
                <p className="mor-eyes-section-lead">Six photos du prototype et une vidéo de démonstration pourront être intégrées ici.</p>
                <div className="mor-eyes-gallery-grid">
                    {gallery.map((item, index) => (
                        <figure key={item.src} className="mor-eyes-gallery-card">
                            <img src={item.src} alt={item.alt} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('is-empty'); }} />
                            <figcaption><span>{String(index + 1).padStart(2, '0')}</span> Photo du projet</figcaption>
                        </figure>
                    ))}
                </div>
                <div className="mor-eyes-video-card">
                    <video controls preload="metadata" poster={`${publicUrl}/images/projects/mor-eyes/video-poster.jpg`}>
                        <source src={`${publicUrl}/images/projects/mor-eyes/demo.mp4`} type="video/mp4" />
                    </video>
                    <div className="mor-eyes-video-caption"><FontAwesomeIcon icon={faPlayCircle} /><span>Vidéo de démonstration — MOR-EYES COM V1.0</span></div>
                </div>
            </section>

            <section className="mor-eyes-section mor-eyes-summary">
                <div className="mor-eyes-section-heading">
                    <span>09</span>
                    <h2>Synthèse</h2>
                </div>
                <p>MOR-EYES COM V1.0 explore une voie de communication alternative pour les personnes sévèrement privées de parole : capter les mouvements oculaires, interpréter les clignements et restituer le message sous forme de parole. Le prototype réunit ainsi vision par ordinateur, traitement d’image, interface homme-machine, base de données locale et synthèse vocale dans une même chaîne biomédicale.</p>
                <div className="mor-eyes-final-credits">
                    <span>Projet réalisé par</span>
                    <strong>Cédric DJOHOZIN · Caleb HOUNYO · Smiss Dossou LAWISSA</strong>
                </div>
            </section>
        </main>
    );
}

export default MorEyesDetails;
