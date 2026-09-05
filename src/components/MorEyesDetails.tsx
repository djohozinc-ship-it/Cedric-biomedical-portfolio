import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faEye, faCamera, faBrain, faCode,
  faDatabase, faPlayCircle, faImages, faWaveSquare,
  faCircleCheck, faLightbulb, faVolumeHigh, faKeyboard, faGear,
  faCircleNodes, faMessage, faPersonCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/MorEyesDetails.scss';

const publicUrl = process.env.PUBLIC_URL || '';

const gallery = Array.from({ length: 6 }, (_, i) => ({
  src: `${publicUrl}/images/projects/mor-eyes/photo-${i + 1}.jpg`,
  alt: `MOR-EYES COM V1.0 — photographie ${i + 1}`,
}));

const pipeline = [
  { icon: faCamera, number: '01', title: 'Acquisition du signal visuel', text: 'Une caméra standard placée face à l’utilisateur capture en temps réel les mouvements du visage et des yeux. Le flux vidéo est transmis au module de traitement afin de conserver une interaction naturelle et une latence minimale.' },
  { icon: faEye, number: '02', title: 'Détection oculomotrice', text: 'Le système localise la région oculaire, extrait les points caractéristiques des yeux et détermine l’état ouvert ou fermé des paupières. La durée du clignement est ensuite mesurée pour distinguer les différentes commandes.' },
  { icon: faBrain, number: '03', title: 'Interprétation algorithmique', text: 'Les événements détectés sont convertis en commandes numériques. La V1.0 exploite deux approches : un mode de sélection par balayage automatique et un mode inspiré du code Morse basé sur des séquences de clignements.' },
  { icon: faVolumeHigh, number: '04', title: 'Restitution vocale', text: 'Une fois le message construit ou sélectionné, il est transmis au module Text-To-Speech. Le texte est converti en audio afin de restituer immédiatement une parole intelligible à l’environnement du patient.' },
];

const libraries = [
  { name: 'MediaPipe', icon: faEye, role: 'Détection et suivi des points faciaux, extraction des landmarks oculaires, analyse des paupières et détermination de l’état ouvert/fermé des yeux.' },
  { name: 'OpenCV', icon: faCamera, role: 'Acquisition du flux caméra, traitement d’image, prétraitement et affichage du pipeline vidéo en temps réel.' },
  { name: 'pyttsx3', icon: faVolumeHigh, role: 'Synthèse vocale locale : conversion texte → voix et lecture immédiate des messages sans dépendre d’un service en ligne.' },
  { name: 'CustomTkinter', icon: faKeyboard, role: 'Construction de l’interface graphique, menus, interactions utilisateur et présentation des fonctions de communication.' },
  { name: 'SQLite3', icon: faDatabase, role: 'Base de données locale pour les phrases rapides, l’historique des messages et les paramètres utilisateurs.' },
];

function MorEyesDetails() {
  return (
    <main className="mor-eyes-page">
      <section className="mor-eyes-hero">
        <div className="mor-eyes-hero-glow glow-one" />
        <div className="mor-eyes-hero-glow glow-two" />
        <div className="mor-eyes-hero-grid" />
        <div className="mor-eyes-hero-inner">
          <button type="button" className="mor-eyes-back" onClick={() => { window.location.hash = ''; }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
          </button>
          <div className="mor-eyes-hero-layout">
            <div className="mor-eyes-hero-content">
              <div className="mor-eyes-kicker"><span>MOR-EYES COM</span><b>01</b> · VERSION 1.0 · SECTEUR BIOMÉDICAL</div>
              <h1>Redonner une voix<br /><em>au regard.</em></h1>
              <p className="mor-eyes-tagline">Système de suppléance oratoire assisté par vision artificielle, conçu pour transformer des mouvements oculaires volontaires en commandes puis en parole.</p>
              <div className="mor-eyes-authors"><span>Projet réalisé par</span> Cédric DJOHOZIN · Caleb HOUNYO · Smiss Dossou LAWISSA</div>
              <div className="mor-eyes-actions">
                <a href="#mor-eyes-pipeline"><FontAwesomeIcon icon={faWaveSquare} /> Comprendre le fonctionnement</a>
                <a href="#mor-eyes-gallery"><FontAwesomeIcon icon={faImages} /> Voir le prototype</a>
              </div>
            </div>

            <div className="mor-eyes-hero-visual" aria-label="Visualisation du système MOR-EYES">
              <div className="hero-visual-orbit orbit-a" />
              <div className="hero-visual-orbit orbit-b" />
              <div className="hero-visual-core">
                <div className="hero-eye">
                  <span className="hero-eye-lid" />
                  <span className="hero-eye-iris"><i /></span>
                </div>
                <div className="hero-scan-line" />
              </div>
              <div className="hero-data-chip chip-top"><b>BLINK</b><span>98.4%</span></div>
              <div className="hero-data-chip chip-right"><b>VISION</b><span>ACTIVE</span></div>
              <div className="hero-data-chip chip-bottom"><b>VOICE</b><span>READY</span></div>
              <div className="hero-visual-label"><span>CANAL OCULAIRE</span><strong>REGARD → COMMANDE → VOIX</strong></div>
            </div>
          </div>
          <div className="mor-eyes-hero-metric"><strong>V1.0</strong><span>Prototype fonctionnel</span></div>
        </div>
      </section>

      <section className="mor-eyes-overview">
        <div className="mor-eyes-overview-inner">
          <div><span>PROBLÈME</span><strong>Communiquer malgré une expression orale fortement limitée.</strong></div>
          <div><span>APPROCHE</span><strong>Vision artificielle + clignements + synthèse vocale.</strong></div>
          <div><span>OBJECTIF</span><strong>Transformer un canal oculaire volontaire en moyen d’expression.</strong></div>
        </div>
      </section>

      <section className="mor-eyes-section mor-eyes-intro">
        <div className="mor-eyes-section-heading"><span>01</span><div><small>LE POINT DE DÉPART</small><h2>Constat & problématique</h2></div></div>
        <div className="mor-eyes-two-column">
          <div className="mor-eyes-rich-copy">
            <p>L’aphasie est un trouble qui peut priver une personne de sa capacité à communiquer oralement, notamment à la suite d’un accident vasculaire cérébral. Dans les situations de paralysie sévère, le patient peut rester conscient de son environnement et conserver le besoin de communiquer alors que ses moyens d’expression sont fortement réduits.</p>
            <p>La présentation de la V1.0 met en avant une situation particulièrement critique : la communication rompue avec le personnel soignant peut accentuer la détresse psychologique et représenter un enjeu important pour la prise en charge.</p>
            <p>Le projet MOR-EYES COM part alors d’une possibilité fonctionnelle : exploiter les mouvements oculaires et palpébraux lorsqu’ils restent disponibles afin de créer un canal de communication alternatif.</p>
          </div>
          <aside className="mor-eyes-problem-card">
            <div className="mor-eyes-corner-video" aria-hidden="true">
              <div className="mor-eyes-corner-video-loader"><span /></div>
              <video autoPlay muted loop playsInline preload="none" poster={`${publicUrl}/images/projects/mor-eyes/video-poster.jpg`}>
                <source src={`${publicUrl}/images/projects/mor-eyes/hero-clip.mp4`} type="video/mp4" />
              </video>
            </div>
            <div className="problem-icon"><FontAwesomeIcon icon={faPersonCircleQuestion} /></div><span>QUESTION DE CONCEPTION</span><strong>Comment permettre à une personne sévèrement privée de parole de transmettre un message à son entourage uniquement à partir de mouvements oculaires volontaires ?</strong>
          </aside>
        </div>
        <div className="mor-eyes-context-grid">
          <div><b>01</b><span>Expression orale limitée</span><p>La communication verbale peut devenir difficile ou impossible.</p></div>
          <div><b>02</b><span>Motricité oculaire exploitable</span><p>Le regard et le clignement peuvent constituer un canal volontaire.</p></div>
          <div><b>03</b><span>Besoin de restitution</span><p>Le message doit finalement être rendu compréhensible à l’entourage.</p></div>
        </div>
      </section>

      <section className="mor-eyes-section mor-eyes-anatomy">
        <div className="mor-eyes-section-heading"><span>02</span><div><small>JUSTIFICATION BIOLOGIQUE</small><h2>Constat anatomique</h2></div></div>
        <div className="mor-eyes-anatomy-layout">
          <div className="mor-eyes-rich-copy"><p>Chez de nombreux patients présentant une aphasie ou une paralysie sévère — notamment dans des contextes tels que l’AVC, la SLA ou le syndrome d’enfermement — la motricité oculaire et palpébrale peut rester préservée.</p><p>La V1.0 s’appuie sur cette observation pour utiliser le regard et le clignement comme voie de communication volontaire. Les nerfs crâniens III, IV et VI sont associés aux muscles oculomoteurs, tandis que le nerf VII intervient notamment dans la motricité des paupières.</p></div>
          <div className="mor-eyes-neuro-cards"><div><strong>III · IV · VI</strong><span>Muscles oculomoteurs</span></div><div><strong>VII</strong><span>Motricité des paupières</span></div><div className="wide"><strong>REGARD + CLIGNEMENT</strong><span>Canal volontaire exploité par le système</span></div></div>
        </div>
      </section>

      <section id="mor-eyes-pipeline" className="mor-eyes-section mor-eyes-pipeline-section">
        <div className="mor-eyes-section-heading"><span>03</span><div><small>CHAÎNE DE TRAITEMENT</small><h2>Comment fonctionne MOR-EYES ?</h2></div></div>
        <p className="mor-eyes-section-lead">La V1.0 est structurée comme une chaîne complète allant de l’acquisition vidéo jusqu’à la restitution vocale.</p>
        <div className="mor-eyes-pipeline">
          {pipeline.map((item) => <article key={item.number}><div className="pipeline-top"><span>{item.number}</span><div><FontAwesomeIcon icon={item.icon} /></div></div><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <div className="mor-eyes-flow"><span>CAMÉRA</span><i>→</i><span>VISION ARTIFICIELLE</span><i>→</i><span>CLIGNEMENTS</span><i>→</i><span>COMMANDES</span><i>→</i><span>MESSAGE</span><i>→</i><span>VOIX</span></div>
        <div className="mor-eyes-blink-section"><div><small>LANGAGE DE COMMANDE · V1.0</small><h3>Les clignements deviennent des actions.</h3></div><div className="blink-cards"><div><strong>01</strong><b>Clignement court</b><span>Commande simple</span></div><div><strong>02</strong><b>Clignement long</b><span>Validation</span></div><div><strong>03</strong><b>Double clignement</b><span>Action spécifique</span></div></div></div>
      </section>

      <section className="mor-eyes-section mor-eyes-software">
        <div className="mor-eyes-section-heading"><span>04</span><div><small>STACK LOGICIELLE</small><h2>Technologies & bibliothèques</h2></div></div>
        <p className="mor-eyes-section-lead">Chaque bibliothèque intervient sur une fonction précise de la chaîne logicielle de la V1.0.</p>
        <div className="mor-eyes-library-grid">{libraries.map((library, index) => <article key={library.name}><div className="library-number">0{index + 1}</div><div className="library-icon"><FontAwesomeIcon icon={library.icon} /></div><h3>{library.name}</h3><p>{library.role}</p></article>)}</div>
      </section>

      <section className="mor-eyes-section mor-eyes-electronics">
        <div className="mor-eyes-section-heading light"><span>05</span><div><small>COUCHE ÉLECTRONIQUE</small><h2>Aspect électronique</h2></div></div>
        <div className="electronics-copy"><p>La présentation de la V1.0 montre également un montage électronique reposant sur une <strong>LED</strong> et une <strong>LDR</strong>. Cette partie complète l’approche logicielle en introduisant une chaîne simple d’émission et de détection lumineuse.</p></div>
        <div className="electronics-stage"><div className="electronic-node"><span>01</span><FontAwesomeIcon icon={faLightbulb} /><strong>LED</strong><small>Émission lumineuse</small></div><div className="electronic-connection"><i></i><span>Flux lumineux</span><i></i></div><div className="electronic-node"><span>02</span><FontAwesomeIcon icon={faCircleNodes} /><strong>LDR</strong><small>Détection lumineuse</small></div></div>
      </section>

      <section className="mor-eyes-section mor-eyes-interface">
        <div className="mor-eyes-section-heading"><span>06</span><div><small>INTERACTION HOMME–MACHINE</small><h2>Usage de l’interface</h2></div></div>
        <div className="interface-layout"><div className="interface-text"><p>L’interface MOR-EYES COM V1.0 a été pensée pour rester accessible après une courte formation préalable. Elle regroupe les fonctions nécessaires à l’interaction avec le patient et à la sélection ou à la construction d’un message.</p><div className="interface-features"><div><FontAwesomeIcon icon={faCode} /><span><b>Mode Morse</b>Interprétation des séquences de clignements.</span></div><div><FontAwesomeIcon icon={faMessage} /><span><b>Phrases rapides</b>Accès à des messages préenregistrés.</span></div><div><FontAwesomeIcon icon={faDatabase} /><span><b>Historique</b>Conservation locale des messages.</span></div><div><FontAwesomeIcon icon={faGear} /><span><b>Paramètres</b>Configuration et adaptation de l’outil.</span></div></div></div><div className="interface-quote"><FontAwesomeIcon icon={faEye} /><span>Une interaction pensée autour d’un canal de communication encore accessible.</span></div></div>
      </section>

      <section id="mor-eyes-gallery" className="mor-eyes-section mor-eyes-gallery-section">
        <div className="mor-eyes-section-heading"><span>07</span><div><small>PREUVES VISUELLES</small><h2>Prototype & démonstration</h2></div></div>
        <p className="mor-eyes-section-lead">La galerie est prête à recevoir les six photographies du projet. Une vidéo permet également de présenter le prototype en fonctionnement.</p>
        <div className="mor-eyes-gallery-grid">{gallery.map((item, index) => <figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy" /><figcaption><b>{String(index + 1).padStart(2, '0')}</b><span>Vue du prototype MOR-EYES COM</span></figcaption></figure>)}</div>
        <div className="mor-eyes-video-card"><div className="video-heading"><div><span>DÉMONSTRATION</span><h3>MOR-EYES COM V1.0 en fonctionnement</h3></div><FontAwesomeIcon icon={faPlayCircle} /></div><video controls preload="metadata" poster={`${publicUrl}/images/projects/mor-eyes/video-poster.jpg`}><source src={`${publicUrl}/images/projects/mor-eyes/demo.mp4`} type="video/mp4" /></video></div>
      </section>

      <section className="mor-eyes-section mor-eyes-conclusion">
        <div className="mor-eyes-section-heading"><span>08</span><div><small>EN SYNTHÈSE</small><h2>Une chaîne biomédicale complète</h2></div></div>
        <p>MOR-EYES COM V1.0 réunit dans un même prototype la vision par ordinateur, le traitement vidéo, l’analyse des mouvements des paupières, l’interprétation de commandes, l’interface homme-machine, le stockage local et la synthèse vocale. Le projet explore ainsi une solution de communication alternative fondée sur un canal volontaire qui peut rester disponible chez certaines personnes sévèrement privées de parole.</p>
        <div className="mor-eyes-conclusion-points"><div><FontAwesomeIcon icon={faCircleCheck} /><span>Acquisition vidéo en temps réel</span></div><div><FontAwesomeIcon icon={faCircleCheck} /><span>Détection des clignements</span></div><div><FontAwesomeIcon icon={faCircleCheck} /><span>Interprétation des commandes</span></div><div><FontAwesomeIcon icon={faCircleCheck} /><span>Restitution vocale hors ligne</span></div></div>
        <div className="mor-eyes-credits"><span>PROJET MOR-EYES COM · V1.0</span><strong>Cédric DJOHOZIN · Caleb HOUNYO · Smiss Dossou LAWISSA</strong></div>
      </section>
    </main>
  );
}

export default MorEyesDetails;
