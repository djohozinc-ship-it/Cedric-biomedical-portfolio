import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBullseye, faChartLine, faCogs, faImages, faLaptopCode, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/PPGComputerVisionDetails.scss';

const publicUrl = process.env.PUBLIC_URL || '';

const mediaItems = [
    { src: `${publicUrl}/images/projects/ppg/roi.png`, title: 'Région d’intérêt (ROI)', caption: 'Zone du visage sélectionnée pour l’extraction des variations photométriques.' },
    { src: `${publicUrl}/images/projects/ppg/signal-ppg-brut.png`, title: 'Signal PPG temporel brut', caption: 'Signal extrait avant les étapes ultérieures de traitement et de détection des pics.' },
    { src: `${publicUrl}/images/projects/ppg/interface.png`, title: 'Interface de démonstration', caption: 'Capture de l’interface utilisée pendant l’expérimentation.' },
    { src: `${publicUrl}/images/projects/ppg/traitement.png`, title: 'Traitement vidéo', caption: 'Capture complémentaire du traitement à ajouter ultérieurement.' },
];

const pipeline = [
    ['01', 'Acquisition vidéo', 'Capture d’une séquence vidéo contenant le visage du sujet.'],
    ['02', 'Détection du visage', 'MediaPipe identifie et suit les repères du visage pour stabiliser l’analyse.'],
    ['03', 'Région d’intérêt', 'Sélection d’une zone cutanée exploitable pour observer les variations photométriques.'],
    ['04', 'Extraction du signal', 'Les informations visuelles sont converties en série temporelle exploitable.'],
    ['05', 'Traitement', 'Nettoyage, analyse des variations périodiques et préparation de l’estimation.'],
    ['06', 'Estimation', 'Conversion de la périodicité observée en estimation du rythme cardiaque.'],
];

const resultCards = [
    { label: 'Chaîne vidéo', value: 'Opérationnelle', note: 'Acquisition et traitement image expérimentés.' },
    { label: 'Suivi du visage', value: 'Réalisé', note: 'Détection d’une région stable pour l’extraction.' },
    { label: 'Signal PPG', value: 'Extrait', note: 'Signal temporel visualisable à partir de la vidéo.' },
    { label: 'BPM / précision', value: 'À renseigner', note: 'Zone volontairement laissée éditable avec tes valeurs réelles.' },
];

const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function PPGComputerVisionDetails() {
    return (
        <main id="top" className="ppg-page">
            <section className="ppg-hero">
                <div className="ppg-hero-copy">
                    <button className="ppg-back" onClick={() => { window.location.hash = ''; }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Retour au portfolio
                    </button>
                    <span className="ppg-kicker">PROJET • VISION PAR ORDINATEUR • TRAITEMENT DU SIGNAL</span>
                    <h1>Estimation du rythme cardiaque par <span>PPG</span> et vision par ordinateur</h1>
                    <p className="ppg-lead">Une expérimentation de photopléthysmographie à distance visant à extraire une information physiologique à partir d’une simple vidéo, sans capteur placé sur le corps.</p>
                    <div className="ppg-tags"><span>Python</span><span>OpenCV</span><span>MediaPipe</span><span>PPG</span><span>Signal Processing</span></div>
                    <div className="ppg-hero-actions">
                        <button type="button" onClick={() => scrollToSection('ppg-demo')}><FontAwesomeIcon icon={faPlayCircle} /> Voir la démonstration</button>
                        <button type="button" onClick={() => scrollToSection('ppg-results')}><FontAwesomeIcon icon={faChartLine} /> Voir les résultats</button>
                    </div>
                </div>
                <div className="ppg-hero-card">
                    <div className="ppg-monitor-grid" aria-hidden="true"></div><div className="ppg-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div className="ppg-bpm">BPM<br /><strong>—</strong></div><div className="ppg-face-frame"><i></i></div><small>LIVE • VIDEO SIGNAL</small>
                </div>
            </section>

            <section className="ppg-section ppg-intro-grid"><div><span className="ppg-section-kicker">01 — CONTEXTE</span><h2>Transformer une vidéo en donnée physiologique exploitable</h2></div><div className="ppg-prose"><p>Le projet explore le principe selon lequel de faibles variations photométriques observables dans une séquence vidéo peuvent contenir une composante périodique liée aux variations du volume sanguin.</p><p>L’objectif n’est pas de remplacer un dispositif médical validé, mais de construire et de tester une chaîne technique complète : acquisition, vision par ordinateur, extraction d’un signal temporel, traitement puis estimation du rythme cardiaque.</p></div></section>

            <section className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">02 — PROBLÉMATIQUE</span><h2>Comment récupérer un signal physiologique sans contact ?</h2></div><div className="ppg-problem-card"><FontAwesomeIcon icon={faBullseye} /><div><strong>Question de départ</strong><p>Comment détecter une région du visage, convertir ses variations visuelles en signal temporel, puis exploiter cette signature pour obtenir une estimation du rythme cardiaque ?</p></div></div></section>

            <section className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">03 — CHAÎNE DE TRAITEMENT</span><h2>De la caméra au rythme cardiaque</h2></div><div className="ppg-pipeline">{pipeline.map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="ppg-architecture">Caméra <b>→</b> visage <b>→</b> ROI <b>→</b> signal vidéo <b>→</b> traitement <b>→</b> estimation BPM</div></section>

            <section className="ppg-section ppg-tech-grid"><div className="ppg-tech-card"><FontAwesomeIcon icon={faLaptopCode} /><span>Vision par ordinateur</span><p>OpenCV pour la lecture, la manipulation et le traitement des images vidéo.</p></div><div className="ppg-tech-card"><FontAwesomeIcon icon={faCogs} /><span>Suivi facial</span><p>MediaPipe pour stabiliser la localisation du visage et de la zone observée.</p></div><div className="ppg-tech-card"><FontAwesomeIcon icon={faChartLine} /><span>Traitement du signal</span><p>Construction d’une série temporelle, analyse des variations et recherche d’une composante périodique exploitable.</p></div></section>

            <section id="ppg-demo" className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">04 — INTERFACE & DÉMONSTRATION</span><h2>Voir le système en fonctionnement</h2></div><div className="ppg-video-box"><video controls preload="metadata" poster={`${publicUrl}/images/projects/ppg/roi.png`}><source src={`${publicUrl}/videos/projects/ppg/demo.mp4`} type="video/mp4" />Votre navigateur ne peut pas lire cette vidéo.</video><div className="ppg-video-overlay"><FontAwesomeIcon icon={faPlayCircle} /><span>Ajoute ta vidéo ici :<strong>/public/videos/projects/ppg/demo.mp4</strong></span></div></div></section>

            <section className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">05 — TRAVAIL VISUEL</span><h2>Captures du traitement et visualisations</h2></div><div className="ppg-media-grid">{mediaItems.map((item) => <figure key={item.src} className="ppg-media-card"><div className="ppg-media-placeholder"><img src={item.src} alt={item.title} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('is-empty'); }} /><span><FontAwesomeIcon icon={faImages} /> Image à ajouter</span></div><figcaption><strong>{item.title}</strong><small>{item.caption}</small></figcaption></figure>)}</div></section>

            <section id="ppg-results" className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">06 — RÉSULTATS</span><h2>Résultats obtenus et éléments à documenter</h2></div><div className="ppg-result-grid">{resultCards.map((item) => <article key={item.label}><small>{item.label}</small><strong>{item.value}</strong><p>{item.note}</p></article>)}</div><div className="ppg-results-note"><FontAwesomeIcon icon={faChartLine} /><div><strong>Important</strong><p>Les mesures finales (BPM de référence, BPM estimé, écart, nombre d’essais, durée de capture, etc.) sont volontairement laissées éditables pour que tu puisses renseigner exactement les valeurs issues de tes expériences.</p></div></div></section>

            <section className="ppg-section"><div className="ppg-section-heading"><span className="ppg-section-kicker">07 — ANALYSE</span><h2>Ce que le projet démontre</h2></div><div className="ppg-analysis-grid"><article><h3>Compétence technique</h3><p>Relier vision par ordinateur, extraction de données et traitement du signal dans une même chaîne expérimentale.</p></article><article><h3>Approche expérimentale</h3><p>Observer le comportement réel du signal, identifier les sources de variation et itérer sur la méthode d’extraction.</p></article><article><h3>Limites</h3><p>La lumière, les mouvements, la qualité vidéo, la peau visible et la stabilité de la région analysée influencent fortement le signal extrait.</p></article><article><h3>Perspective</h3><p>Améliorer la robustesse de la chaîne, documenter les mesures comparatives et étudier la reproductibilité sur plusieurs acquisitions.</p></article></div></section>

            <section className="ppg-footer-card"><div><span>PROJET PERSONNEL</span><h2>Un projet à l’intersection de la santé, de l’IA et du traitement du signal.</h2></div><div className="ppg-footer-links"><button type="button" onClick={() => scrollToSection('top')}><FontAwesomeIcon icon={faArrowLeft} /> Retour en haut</button></div></section>
        </main>
    );
}
