import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDroplet, faMicrochip, faMobileScreenButton, faShieldHalved, faChartLine, faScrewdriverWrench, faLeaf, faTriangleExclamation, faCircleCheck, faGaugeHigh, faNetworkWired, faVideo, faImages } from '@fortawesome/free-solid-svg-icons';
import './SacruroDetails.scss';

const imagePlaceholders = [
  { title: 'Mesure du TDS', file: 'sacruro-mesure-tds.webp', text: 'Photographie du TDS-mètre utilisé lors de la mesure.' },
  { title: 'Application mobile', file: 'sacruro-app-tableau-de-bord.webp', text: 'Capture du tableau de bord de supervision.' },
  { title: 'Application mobile — synoptique', file: 'sacruro-app-synoptique.webp', text: 'Capture du synoptique hydraulique.' },
  { title: 'Application mobile — historique', file: 'sacruro-app-historique.webp', text: 'Capture de l’historique des mesures.' },
];

const MediaPlaceholder = ({ title, file, text }: { title: string; file: string; text: string }) => (
  <div className="sacruro-media-placeholder" data-file={file}>
    <FontAwesomeIcon icon={faImages} />
    <strong>{title}</strong>
    <span>{text}</span>
    <small>{file}</small>
  </div>
);

const Section = ({ number, title, icon, children, className = '' }: { number: string; title: string; icon: any; children: React.ReactNode; className?: string }) => (
  <section className={`sacruro-section ${className}`}>
    <div className="sacruro-section-heading">
      <span>{number}</span>
      <h2><FontAwesomeIcon icon={icon} /> {title}</h2>
    </div>
    <div className="sacruro-section-content">{children}</div>
  </section>
);

export default function SacruroDetails() {
  return (
    <main className="sacruro-page">
      <div className="sacruro-container">
        <button className="sacruro-back" onClick={() => { window.location.hash = ''; window.scrollTo(0, 0); }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
        </button>

        <header className="sacruro-hero">
          <div className="sacruro-hero-copy">
            <span className="sacruro-eyebrow">PROJET DE FIN D’ÉTUDES · 22 JUILLET 2026</span>
            <h1>SACRURO</h1>
            <h3>Système Automatique Connecté de Récupération et de Valorisation des Rejets d’Osmoseur</h3>
            <p className="sacruro-lead">Étude et conception d’un système automatique connecté destiné à récupérer et valoriser les rejets d’un osmoseur d’une unité de dialyse du Centre Hospitalier Départemental du Zou pour des usages non médicaux et non alimentaires.</p>
            <div className="sacruro-meta">
              <span>Génie biomédical</span><span>Automatisation</span><span>Électronique</span><span>IoT</span><span>Gestion de l’eau</span>
            </div>
            <div className="sacruro-authors"><strong>DJOHOZIN Cédric</strong><span>·</span><strong>SOSSOUNON Médessè Géraldine</strong><br/><small>Licence Professionnelle — Maintenance Biomédicale et Hospitalière · Département de Génie Biomédical · EPAC/UAC</small></div>
          </div>
          <div className="sacruro-hero-card">
            <div className="sacruro-orbit"><FontAwesomeIcon icon={faDroplet} /></div>
            <div className="sacruro-hero-card-label">ÉTUDE DE CONCEPTION & PRÉVALIDATION</div>
            <div className="sacruro-stat"><strong>5 850 L/j</strong><span>rejet estimé sur la base des observations de terrain</span></div>
            <div className="sacruro-stat"><strong>10 000 L</strong><span>capacité du réservoir de stockage étudié</span></div>
          </div>
        </header>

        <Section number="01" title="Contexte" icon={faDroplet}>
          <p>Dans l’unité de dialyse du CHD-Zou, l’osmose inverse produit une eau traitée destinée au fonctionnement des générateurs de dialyse et un concentrat rejeté. Ce rejet est évacué alors qu’il représente un volume d’eau potentiellement valorisable pour des usages non médicaux. L’étude SACRURO part de ce constat afin de proposer une solution automatique de récupération, de surveillance et de distribution.</p>
          <p>Le fonctionnement observé concerne 10 générateurs de dialyse, utilisés approximativement 10 heures par jour, du lundi au samedi.</p>
        </Section>

        <Section number="02" title="Problématique" icon={faTriangleExclamation}>
          <div className="sacruro-highlight"><p>Comment récupérer, surveiller et distribuer les rejets de l’osmoseur de manière contrôlée, tout en respectant les contraintes techniques, sanitaires et opérationnelles d’un environnement hospitalier&nbsp;?</p></div>
          <p>Le rejet actuellement évacué contribue au gaspillage d’eau et peut participer aux débordements fréquents du puisard, à l’humidité persistante et à la dégradation des abords du local de traitement d’eau.</p>
        </Section>

        <Section number="03" title="Objectif général" icon={faCircleCheck}>
          <p>Concevoir un système automatique, connecté et sécurisé permettant de récupérer les rejets de l’osmoseur du CHD-Zou pour des usages non médicaux, tout en contribuant à la réduction du gaspillage d’eau et à la protection de l’environnement et des infrastructures autour du local de traitement d’eau.</p>
        </Section>

        <Section number="04" title="Objectifs spécifiques" icon={faChartLine}>
          <ul className="sacruro-list"><li>Étudier les possibilités de valorisation du rejet.</li><li>Concevoir l’architecture hydraulique et dimensionner les réservoirs.</li><li>Estimer le volume quotidien rejeté à partir des mesures de terrain.</li><li>Concevoir l’architecture électronique et la commande automatique des actionneurs.</li><li>Assurer la supervision des volumes, paramètres de qualité et alarmes.</li><li>Permettre la surveillance à distance et la continuité locale en cas de perte de communication.</li><li>Évaluer les impacts économiques et environnementaux attendus.</li></ul>
        </Section>

        <Section number="05" title="Principe général de fonctionnement" icon={faNetworkWired}>
          <div className="sacruro-flow"><span>Rejet de l’osmoseur</span><b>→</b><span>Préfiltration</span><b>→</b><span>Réservoir tampon 1 000 L</span><b>→</b><span>Pompe P0</span><b>→</b><span>Ultrafiltration</span><b>→</b><span>Stockage 10 000 L</span><b>→</b><span>Filtration de sortie</span><b>→</b><span>Pompe P2</span><b>→</b><span>Points d’utilisation</span></div>
          <p>Une branche dédiée permet le rétrolavage de la membrane d’ultrafiltration avec la pompe P1 et les électrovannes associées. Des dispositifs de dérivation automatique et manuelle permettent de basculer vers l’eau SONEB lorsque l’eau récupérée est insuffisante ou lorsque le système doit être isolé.</p>
        </Section>

        <Section number="06" title="Architecture hydraulique" icon={faDroplet} className="diagram-section">
          <div className="diagram-only"><span>Schéma hydraulique complet du système SACRURO</span><small>Récupération · préfiltration · stockage tampon · ultrafiltration · rétrolavage · stockage · distribution · dérivations</small></div>
        </Section>

        <Section number="07" title="Instrumentation" icon={faGaugeHigh}>
          <div className="sacruro-grid"><div><strong>Niveau</strong><p>JSN-SR04T ultrasonique étanche, utilisé pour suivre le niveau des réservoirs.</p></div><div><strong>Débit</strong><p>YF-B10 à effet Hall, placé à la sortie du réservoir de stockage.</p></div><div><strong>TDS / conductivité</strong><p>SEN0244 DFRobot pour le suivi de la qualité physico-chimique.</p></div><div><strong>pH</strong><p>SEN0161-V2 pour la mesure du pH.</p></div><div><strong>Température</strong><p>DS18B20 pour la surveillance thermique.</p></div></div>
        </Section>

        <Section number="08" title="Mesures réalisées sur le terrain" icon={faChartLine}>
          <p>Les observations de terrain ont permis d’estimer le rejet à partir des cycles de fonctionnement. Une observation expérimentale a relevé 9 L en 3 s, soit 3 L/s. Le 19 juin 2026, 13 événements de débit d’environ 15 s par heure ont été observés, soit 195 s/h et un débit moyen estimé à 585 L/h ; sur une durée de fonctionnement de 10 h/jour, cela correspond à environ 5 850 L/jour. Par ailleurs, le débitmètre intégré à l’osmoseur a indiqué 1 500 L/h côté perméat et 650 L/h côté concentrat, avec un taux de récupération de 70 %. Ces deux valeurs de débit de rejet sont conservées séparément, car elles proviennent de méthodes de mesure différentes.</p>
        </Section>

        <Section number="09" title="Caractérisation physico-chimique" icon={faDroplet}>
          <div className="sacruro-table-wrap"><table><thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead><tbody><tr><td>Turbidité</td><td>0,713 NTU</td></tr><tr><td>Calcium</td><td>Pas de trace</td></tr><tr><td>Magnésium</td><td>Pas de trace</td></tr><tr><td>Chlorures</td><td>2,1 mg/L</td></tr><tr><td>Nitrates</td><td>5,75 mg/L</td></tr><tr><td>TDS</td><td>39 ppm</td></tr><tr><td>Conductivité</td><td>47,9 µS/cm</td></tr><tr><td>pH</td><td>6,67</td></tr></tbody></table></div>
          <p>Le TDS-mètre TDS-3 a été utilisé le 21 mai 2026 à 14 h 09 : eau SONEB 25 ppm, perméat 3 ppm et concentrat 39 ppm. Le pH mesuré à 6,67 se situe dans la plage de surveillance retenue de 6,5 à 8,5, mais reste proche de la limite basse. Le sodium n’a pas pu être analysé en raison des contraintes du laboratoire et la microbiologie n’a pas été réalisée. En conséquence, ces résultats ne constituent pas une validation sanitaire définitive pour un usage direct.</p>
          <div className="sacruro-media-single"><MediaPlaceholder {...imagePlaceholders[0]} /></div>
        </Section>

        <Section number="10" title="Usages envisagés" icon={faDroplet}>
          <div className="sacruro-use-grid"><span>Chasse d’eau des toilettes</span><span>Arrosage des plantes et espaces verts</span><span>Nettoyage des sols</span><span>Lavage des véhicules de service</span><span>Usages de lavage non alimentaire, selon validation préalable</span></div>
        </Section>

        <Section number="11" title="Architecture électronique" icon={faMicrochip} className="diagram-section">
          <div className="diagram-only"><span>Architecture électronique et schéma électronique complet</span><small>ESP32 · acquisition · extension E/S · watchdog · commande de puissance · alimentation · interfaces locales</small></div>
        </Section>

        <Section number="12" title="Acquisition analogique" icon={faMicrochip}>
          <p>L’ADS1115IDGS est un convertisseur analogique-numérique 16 bits à quatre entrées analogiques et interface I²C. Il est utilisé notamment pour l’acquisition du pH et de la conductivité/TDS, avec une résolution supérieure à celle des entrées analogiques intégrées de l’ESP32.</p>
        </Section>

        <Section number="13" title="Surveillance matérielle" icon={faShieldHalved}>
          <p>Le TLC555 est utilisé comme watchdog matériel en mode monostable. L’ESP32 envoie périodiquement un signal de maintien ; en cas d’absence de ce signal, le TLC555 déclenche une réinitialisation afin de renforcer la continuité de fonctionnement.</p>
        </Section>

        <Section number="14" title="Commande de puissance" icon={faMicrochip}>
          <p>Les actionneurs sont commandés par relais et interfaces de commutation adaptées. L’ESP32 ne pilote pas directement les bobines des relais. L’alimentation est organisée sur quatre niveaux : 5 V continu pour les capteurs et l’afficheur, 3,3 V continu pour l’ESP32 et la logique, 24 V continu pour les électrovannes et 220 V alternatif pour les pompes P0, P1 et P2.</p>
          <div className="sacruro-chips"><span>E1 · NF · 24 V</span><span>E2 · NF · 24 V</span><span>E3 · NO · 24 V</span><span>E4 · NO · 24 V</span><span>E5 · NO · 24 V</span><span>E6 · NF · 24 V</span></div>
        </Section>

        <Section number="15" title="Interface locale" icon={faMobileScreenButton}>
          <p>L’interface locale associe un avertisseur sonore, des voyants d’état et un afficheur LCD 16×2 via I²C. Le vert indique un fonctionnement normal, le jaune une situation de vigilance et le rouge une situation critique. Un voyant vert dédié signale l’appairage. Cinq boutons permettent les commandes <strong>Valider</strong>, <strong>Haut</strong>, <strong>Bas</strong>, <strong>Retour</strong> et <strong>Appairage</strong>.</p>
        </Section>

        <Section number="16" title="Automatisation" icon={faScrewdriverWrench}>
          <p>Le système gère automatiquement le remplissage, la filtration, l’ultrafiltration, la distribution et le rétrolavage selon les niveaux, mesures et états des actionneurs. La pompe de distribution est arrêtée lorsque le niveau du réservoir tampon devient insuffisant afin d’éviter un fonctionnement à sec. À niveau maximal, l’électrovanne E1 est fermée automatiquement pour limiter le risque de débordement.</p>
          <p>Le dérivatif automatique repose sur E4 et E5 : lorsque l’eau récupérée est insuffisante, E4 se ferme et E5 s’ouvre afin d’alimenter le réseau depuis la SONEB ; lorsque le volume récupéré redevient suffisant, E5 se ferme et E4 s’ouvre. Le dérivatif manuel V3/V4 permet une isolation en cas de maintenance, de panne ou de diagnostic.</p>
        </Section>

        <Section number="17" title="Seuils de surveillance" icon={faShieldHalved}>
          <div className="sacruro-thresholds"><div><strong>pH</strong><span>6,5 – 8,5</span></div><div><strong>TDS</strong><span>≤ 600 ppm</span></div><div><strong>Température</strong><span>≤ 37 °C</span></div><div><strong>Niveau</strong><span>seuils min. / max.</span></div></div>
          <p className="sacruro-note">Le seuil TDS de 600 ppm est un seuil de conception et de surveillance retenu dans l’étude ; il ne constitue pas, à lui seul, une preuve de conformité à une norme universelle de réutilisation.</p>
        </Section>

        <Section number="18" title="Connectivité IoT" icon={faNetworkWired}>
          <div className="sacruro-flow"><span>Application mobile</span><b>→</b><span>Internet</span><b>→</b><span>MQTT</span><b>→</b><span>ESP32</span></div>
          <p>En mode local, l’application communique directement avec le point d’accès Wi-Fi de l’ESP32, sans dépendre d’Internet. Ce mode est utile pour la maintenance, le diagnostic, la configuration initiale et la continuité lorsque la connexion distante n’est plus disponible.</p>
        </Section>

        <Section number="19" title="Communication MQTT et sécurité" icon={faShieldHalved}>
          <p>La communication repose sur MQTT avec étude des niveaux de qualité de service QoS 0, 1 et 2 ; le QoS 1 a été retenu pour assurer une livraison au moins une fois tout en limitant la surcharge. Les communications distantes utilisent WSS/TLS. L’accès initial passe par un appairage physique avec mécanisme de défi-réponse, les paramètres sensibles sont conservés localement de manière sécurisée et les commandes sont limitées à 10 requêtes sur 15 secondes.</p>
        </Section>

        <Section number="20" title="Application mobile" icon={faMobileScreenButton}>
          <p>Développée avec React Native et Expo, l’application regroupe les fonctions d’<strong>Appairage</strong>, de <strong>Tableau de bord</strong>, de <strong>Synoptique hydraulique</strong>, d’<strong>Historique</strong>, d’<strong>Assistant conversationnel</strong> et de <strong>Configuration</strong>. Le tableau de bord présente en temps réel le pH, la conductivité, le TDS, le débit, la température, les niveaux et les alarmes. L’historique conserve les 50 dernières valeurs de pH, TDS et débit. L’assistant accepte notamment les commandes <strong>Rapport</strong>, <strong>Alarmes</strong> et <strong>Exporter en PDF</strong>.</p>
          <div className="sacruro-media-grid">{imagePlaceholders.slice(1).map((item) => <MediaPlaceholder key={item.file} {...item} />)}</div>
        </Section>

        <Section number="21" title="Continuité de fonctionnement" icon={faShieldHalved}>
          <p>La surveillance de la communication considère l’absence de message pendant 30 secondes comme une perte de connexion et déclenche le passage automatique vers le mode local. Cette continuité de communication complète l’automatisation hydraulique, qui est conçue pour fonctionner indépendamment de la présence permanente de l’application mobile.</p>
        </Section>

        <Section number="22" title="Gestion des risques" icon={faTriangleExclamation}>
          <p>L’analyse de risques couvre 16 scénarios. Les criticités les plus élevées concernent notamment la qualité microbiologique (20), le débordement du réservoir tampon (16), la coupure d’alimentation (16), la non-conformité sanitaire ou réglementaire (16), le retour d’eau vers le réseau potable (15), la dégradation de la membrane d’ultrafiltration (15) et les erreurs de mesure du pH/TDS (15). Le risque de fonctionnement à sec et le colmatage des filtres sont également surveillés.</p>
        </Section>

        <Section number="23" title="Résultats économiques estimés" icon={faChartLine}>
          <div className="sacruro-economic"><div><strong>3 142 200 FCFA</strong><span>investissement initial estimé</span></div><div><strong>500 000 FCFA</strong><span>maintenance préventive et corrective estimée sur 5 ans</span></div><div><strong>1 231 608 FCFA/an</strong><span>économie annuelle estimée</span></div><div><strong>2 ans 9 mois</strong><span>retour sur investissement estimé</span></div></div>
          <p>Sur 5 ans, l’économie estimée atteint 6 158 040 FCFA. Après prise en compte de l’investissement initial et de la maintenance estimée, l’économie nette théorique est de 2 515 840 FCFA. Ces valeurs sont des estimations économiques de l’étude et ne correspondent pas à des économies déjà réalisées.</p>
        </Section>

        <Section number="24" title="Impact environnemental attendu" icon={faLeaf}>
          <p>La récupération du rejet vise à réduire les volumes d’eau perdus et à limiter les débordements du puisard, l’infiltration, l’humidité et les dégradations potentielles des murs et fondations autour du local de traitement d’eau. Le projet s’inscrit ainsi dans une démarche de gestion plus durable de la ressource en eau en milieu hospitalier.</p>
        </Section>

        <Section number="25" title="Limites de l’étude" icon={faTriangleExclamation}>
          <p>SACRURO constitue une étude de conception et de prévalidation. Elle ne modifie pas la chaîne existante de traitement de l’eau de dialyse, ne vise pas les usages médicaux ou alimentaires, ne comporte pas d’analyse microbiologique approfondie et ne traite pas d’autres osmoseurs. Les résultats physico-chimiques disponibles ne permettent donc pas, à eux seuls, de déclarer l’eau directement réutilisable sans validations complémentaires.</p>
        </Section>

        <Section number="26" title="Perspectives" icon={faLeaf}>
          <ul className="sacruro-list"><li>Réaliser les analyses microbiologiques nécessaires avant toute mise en œuvre réelle.</li><li>Obtenir les autorisations environnementales et sanitaires appropriées.</li><li>Étudier l’intégration éventuelle de panneaux solaires.</li><li>Évaluer une étape complémentaire de réduction des sels dissous, par exemple la déionisation capacitive ou une technologie équivalente.</li><li>Étudier la reproductibilité du concept dans d’autres établissements hospitaliers.</li></ul>
        </Section>

        <Section number="27" title="Technologies utilisées" icon={faMicrochip}>
          <div className="sacruro-techs">{['ESP32','C/C++','ADS1115','MCP23017','TLC555','JSN-SR04T','YF-B10','SEN0244','SEN0161-V2','DS18B20','MQTT','WSS/TLS','React Native','Expo','KiCad'].map(t => <span key={t}>{t}</span>)}</div>
        </Section>

        <Section number="28" title="Compétences mobilisées" icon={faScrewdriverWrench}>
          <div className="sacruro-use-grid"><span>Analyse d’un besoin hospitalier</span><span>Conception hydraulique</span><span>Dimensionnement</span><span>Électronique embarquée</span><span>Acquisition analogique</span><span>Automatisation</span><span>Firmware</span><span>IoT et MQTT</span><span>Développement mobile</span><span>Cybersécurité appliquée</span><span>Analyse de risques</span><span>Maintenance biomédicale</span><span>Évaluation économique</span></div>
        </Section>

        <Section number="29" title="Contribution au projet" icon={faScrewdriverWrench}>
          <p>Travail réalisé en binôme dans le cadre du mémoire. Le projet couvre l’étude du besoin, la conception du système, l’électronique, le firmware, la logique de contrôle, la communication IoT, l’application mobile, l’analyse des risques, la maintenance et l’évaluation économique.</p>
        </Section>

        <Section number="30" title="Ce que le projet démontre" icon={faCircleCheck}>
          <div className="sacruro-highlight"><p>SACRURO n’est pas seulement un prototype autour d’un ESP32. C’est une étude d’ingénierie multidisciplinaire appliquée à un problème réel de gestion de l’eau en milieu hospitalier, reliant données de terrain, caractérisation de l’eau, conception hydraulique, électronique, automatisation, IoT, sécurité, gestion des risques, maintenance et évaluation économique.</p></div>
        </Section>

        <Section number="31" title="Mots-clés" icon={faNetworkWired}>
          <div className="sacruro-techs"><span>Génie biomédical</span><span>Osmose inverse</span><span>Réutilisation de l’eau</span><span>ESP32</span><span>Automatisation</span><span>IoT</span><span>MQTT</span><span>Ultrafiltration</span><span>React Native</span><span>Maintenance hospitalière</span></div>
        </Section>

        <Section number="32" title="Résumé court pour la page d’accueil" icon={faCircleCheck}>
          <p className="sacruro-home-summary">SACRURO est une étude de conception d’un système automatique et connecté destiné à récupérer et valoriser les rejets d’un osmoseur d’une unité de dialyse du CHD-Zou. Le projet combine hydraulique, électronique embarquée, automatisation, IoT, supervision mobile et analyse des risques afin de proposer une solution de réutilisation pour des usages non médicaux.</p>
        </Section>

        <Section number="33" title="Démonstration de la supervision en temps réel" icon={faVideo}>
          <p>La démonstration montre la chaîne complète de supervision : des potentiomètres sont utilisés pour simuler les signaux de capteurs, leurs valeurs sont transmises à l’ESP32, puis l’ESP32 envoie les données à l’application mobile. La vidéo illustre ainsi la réception et l’affichage des données en temps réel. Cette démonstration valide la chaîne de communication et de supervision du prototype ; elle ne constitue pas une validation métrologique des capteurs réels.</p>
          <div className="sacruro-video-placeholder"><FontAwesomeIcon icon={faVideo} /><strong>Vidéo de démonstration SACRURO</strong><span>À remplacer par la vidéo finale après dépôt de l’élément multimédia.</span><small>sacruro-demonstration-supervision.mp4</small></div>
        </Section>
      </div>
    </main>
  );
}
