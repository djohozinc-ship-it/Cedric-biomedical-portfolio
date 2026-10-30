import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleCheck, faImages, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/PPGComputerVisionDetails.scss';

const publicUrl = process.env.PUBLIC_URL || '';

type Capture = { src: string; title: string; caption: string; alt: string };

const prototypeCapture: Capture = {
    src: `${publicUrl}/images/projects/ppg/signal-ppg-brut.jpg`,
    title: 'Prototype en fonctionnement',
    alt: 'Capture du prototype : fenêtre HealthVision avec la région analysée sur le visage, fenêtre Signal, fenêtre Mask et valeurs B, G, R affichées dans la console',
    caption: 'Fenêtre HealthVision (visage et région analysée), fenêtre Signal (signal temporel), fenêtre Mask (masque de la ROI) et valeurs moyennes B, G, R relevées à chaque image dans la console.',
};

const roiCapture: Capture = {
    src: `${publicUrl}/images/projects/ppg/roi.jpg`,
    title: 'Sélection de la ROI : problème identifié',
    alt: 'Capture des fenêtres HealthVision, avec les landmarks MediaPipe numérotés, et Mask, où la région d’intérêt apparaît comme une ligne presque verticale',
    caption: 'Landmarks MediaPipe numérotés (à gauche) et masque de la ROI (à droite). Avec les landmarks [10, 151, 9, 8], le masque se réduit à une ligne presque verticale : il ne couvre pas une surface cutanée exploitable.',
};

const captures: Capture[] = [roiCapture, prototypeCapture];

const pipeline: [string, string, string][] = [
    ['01', 'Acquisition vidéo', 'Flux de la webcam lu en direct avec OpenCV.'],
    ['02', 'Détection faciale', 'MediaPipe Face Landmarker localise le visage et ses repères (landmarks).'],
    ['03', 'Extraction de la ROI', 'Un masque est construit à partir de landmarks choisis pour isoler une région de peau.'],
    ['04', 'Extraction des couleurs', 'Calcul de la valeur moyenne des canaux B, G et R de la région, image par image.'],
    ['05', 'Construction du signal', 'La moyenne du canal vert au cours du temps forme le signal PPG brut.'],
    ['06', 'Filtrage', 'Filtre passe-bande (SciPy) pour isoler la bande de fréquences du pouls.'],
    ['07', 'Détection des pics', 'Les pics du signal filtré correspondent aux battements estimés.'],
    ['08', 'Estimation du BPM', 'La fréquence des pics est convertie en battements par minute (estimation expérimentale).'],
];

const technologies: [string, string][] = [
    ['Python', 'Langage du prototype et de l’ensemble de la chaîne.'],
    ['OpenCV', 'Acquisition vidéo, manipulation des images et affichage des fenêtres de contrôle.'],
    ['MediaPipe Face Landmarker', 'Détection du visage et des points de repère.'],
    ['NumPy', 'Calcul des moyennes de canaux et manipulation du signal.'],
    ['SciPy', 'Filtrage passe-bande et détection des pics.'],
    ['rPPG', 'Photopléthysmographie à distance : principe d’extraction d’une composante pulsatile à partir de la couleur de la peau.'],
];

const operational = [
    'Acquisition vidéo en direct avec une webcam',
    'Détection du visage avec MediaPipe',
    'Extraction d’une région d’intérêt (ROI)',
    'Calcul des valeurs moyennes des canaux BGR',
    'Construction d’un signal temporel à partir du canal vert',
    'Filtrage passe-bande du signal (SciPy)',
    'Détection des pics du signal filtré',
    'Estimation expérimentale de la fréquence cardiaque en BPM',
    'Visualisation du signal filtré et des pics détectés',
];

const inDevelopment = [
    { title: 'Sélection de la ROI', text: 'Les landmarks actuellement utilisés ([10, 151, 9, 8]) ne délimitent pas une surface cutanée exploitable : le masque se réduit à une ligne presque verticale. Le choix des points doit être revu.' },
    { title: 'Qualité et stabilité du signal', text: 'Le signal dépend directement de la ROI. Tant qu’elle n’est pas corrigée, le signal extrait et les pics détectés restent à interpréter avec prudence.' },
    { title: 'Fiabilité du BPM', text: 'Le BPM est calculé, mais sa précision n’a pas encore été validée par comparaison avec un dispositif de référence.' },
];

const limits: [string, string][] = [
    ['Éclairage', 'Les variations de lumière ambiante, l’exposition automatique et la balance des blancs de la webcam peuvent masquer les très faibles variations de couleur liées au pouls.'],
    ['Mouvements', 'Les mouvements de la tête déplacent la région analysée et introduisent des variations bien plus fortes que le signal recherché.'],
    ['Stabilité de la ROI', 'Une région qui change de forme ou de position d’une image à l’autre dégrade directement le signal. C’est le point actuellement le plus limitant.'],
    ['Fréquence d’acquisition', 'La cadence réelle de la webcam et sa régularité conditionnent l’échantillonnage et la précision de l’estimation en fréquence.'],
    ['Qualité du signal', 'Bruit du capteur, compression vidéo et choix du filtrage influencent la détection des pics, donc le BPM obtenu.'],
    ['Validation', 'Aucune comparaison avec un oxymètre ou un autre appareil de référence n’a encore été faite : aucune précision n’est revendiquée.'],
];

const perspectives: [string, string][] = [
    ['Améliorer la ROI', 'Choisir d’autres landmarks pour obtenir une surface de peau plus large et stable (par exemple le front et les joues) et vérifier le masque visuellement.'],
    ['Renforcer la robustesse du signal', 'Mieux gérer les mouvements et les changements d’éclairage, et contrôler la qualité du signal avant de calculer un BPM.'],
    ['Tester des algorithmes rPPG', 'Comparer la méthode actuelle (canal vert) à des algorithmes établis comme POS ou CHROM, qui combinent les canaux de couleur.'],
    ['Valider par comparaison', 'Mesurer en parallèle avec un appareil de référence et analyser l’écart, avant toute conclusion sur la précision.'],
];

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function PPGComputerVisionDetails() {
    const [selectedImage, setSelectedImage] = useState<Capture | null>(null);

    useEffect(() => {
        if (!selectedImage) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedImage(null);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    return (
        <main id="top" className="ppg-page">
            <section className="ppg-hero">
                <div className="ppg-hero-copy">
                    <button type="button" className="ppg-back" onClick={() => { window.location.hash = ''; }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Retour au portfolio
                    </button>
                    <span className="ppg-kicker">Prototype expérimental · vision par ordinateur · traitement du signal</span>
                    <h1>Estimation du rythme cardiaque par <span>PPG</span> et vision par ordinateur</h1>
                    <p className="ppg-lead">Prototype de photopléthysmographie à distance (rPPG) : à partir du flux d’une webcam, il extrait un signal de la couleur de la peau du visage, le filtre, détecte les pics et en déduit une estimation du rythme cardiaque.</p>
                    <div className="ppg-tags"><span>Python</span><span>OpenCV</span><span>MediaPipe</span><span>NumPy</span><span>SciPy</span><span>rPPG</span></div>
                    <div className="ppg-hero-actions">
                        <button type="button" onClick={() => scrollToSection('ppg-etat')}>État d’avancement</button>
                        <button type="button" onClick={() => scrollToSection('ppg-captures')}>Captures</button>
                    </div>
                </div>
                <figure className="ppg-hero-figure">
                    <button type="button" className="ppg-zoom" onClick={() => setSelectedImage(prototypeCapture)} aria-label={`Agrandir : ${prototypeCapture.title}`}>
                        <img src={prototypeCapture.src} alt={prototypeCapture.alt} />
                    </button>
                    <figcaption>{prototypeCapture.title}. Cliquer pour agrandir.</figcaption>
                </figure>
            </section>

            <section className="ppg-status" aria-label="Statut du projet">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <p><strong>Statut : prototype de recherche.</strong> Ce n’est pas un dispositif médical et il ne doit pas servir au diagnostic. Il estime uniquement une fréquence cardiaque, dont la précision n’a pas encore été validée par rapport à un appareil de référence.</p>
            </section>

            <section className="ppg-section ppg-intro-grid">
                <div><span className="ppg-section-kicker">01 · Contexte et objectif</span><h2>Extraire un pouls d’une vidéo</h2></div>
                <div className="ppg-prose">
                    <p>À chaque battement, le volume de sang dans la peau varie très légèrement, et avec lui la quantité de lumière absorbée. La rPPG cherche à retrouver cette variation dans les canaux de couleur d’une vidéo ordinaire, sans capteur posé sur le corps.</p>
                    <p>L’objectif du projet est de construire et de tester une chaîne complète, de la caméra à l’estimation du BPM, et d’identifier précisément ce qui limite aujourd’hui sa fiabilité.</p>
                </div>
            </section>

            <section className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">02 · Chaîne de traitement</span><h2>De la webcam au BPM</h2></div>
                <ol className="ppg-pipeline">{pipeline.map(([n, title, text]) => <li key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
                <p className="ppg-architecture">Acquisition vidéo <b>→</b> détection faciale <b>→</b> ROI <b>→</b> couleurs BGR <b>→</b> signal <b>→</b> filtrage <b>→</b> pics <b>→</b> BPM</p>
            </section>

            <section className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">03 · Technologies</span><h2>Outils utilisés</h2></div>
                <dl className="ppg-tech">{technologies.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl>
            </section>

            <section id="ppg-etat" className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">04 · État d’avancement</span><h2>Ce qui fonctionne, ce qui reste à corriger</h2></div>
                <div className="ppg-state-grid">
                    <article className="ppg-state ppg-state--ok">
                        <h3><FontAwesomeIcon icon={faCircleCheck} /> Fonctionnalités opérationnelles</h3>
                        <ul>{operational.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="ppg-state ppg-state--wip">
                        <h3><FontAwesomeIcon icon={faTriangleExclamation} /> En cours de développement</h3>
                        <ul>{inDevelopment.map((item) => <li key={item.title}><strong>{item.title}.</strong> {item.text}</li>)}</ul>
                    </article>
                </div>
            </section>

            <section id="ppg-captures" className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">05 · Captures</span><h2>Le prototype en fonctionnement</h2></div>
                <div className="ppg-media-grid">{captures.map((item) => (
                    <figure key={item.src} className="ppg-media-card">
                        <button type="button" className="ppg-zoom" onClick={() => setSelectedImage(item)} aria-label={`Agrandir : ${item.title}`}>
                            <img src={item.src} alt={item.alt} />
                            <span className="ppg-zoom-hint"><FontAwesomeIcon icon={faImages} /> Agrandir</span>
                        </button>
                        <figcaption><strong>{item.title}</strong><small>{item.caption}</small></figcaption>
                    </figure>
                ))}</div>
            </section>

            <section className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">06 · Limites expérimentales</span><h2>Ce qui influence la mesure</h2></div>
                <div className="ppg-limits">{limits.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
            </section>

            <section className="ppg-section">
                <div className="ppg-section-heading"><span className="ppg-section-kicker">07 · Perspectives</span><h2>Prochaines étapes</h2></div>
                <ol className="ppg-roadmap">{perspectives.map(([title, text], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
            </section>

            <section className="ppg-footer-card">
                <div><span>Projet personnel</span><h2>Photopléthysmographie à distance : une chaîne fonctionnelle, à fiabiliser.</h2></div>
                <div className="ppg-footer-links">
                    <button type="button" onClick={() => scrollToSection('top')}><FontAwesomeIcon icon={faArrowLeft} /> Retour en haut</button>
                </div>
            </section>

            {selectedImage && (
                <div className="ppg-lightbox" role="dialog" aria-modal="true" aria-label={selectedImage.title} onClick={() => setSelectedImage(null)}>
                    <button type="button" className="ppg-lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Fermer l’image agrandie">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <div className="ppg-lightbox-content" onClick={(event) => event.stopPropagation()}>
                        <img src={selectedImage.src} alt={selectedImage.alt} />
                        <div>{selectedImage.title}</div>
                    </div>
                </div>
            )}
        </main>
    );
}
