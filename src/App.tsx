import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Main from "./components/Main";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HeroVideo from './components/HeroVideo';
import Project from "./components/Project";
import FadeIn from './components/FadeIn';
import './index.scss';
import './assets/styles/FichesPropres.scss';

const Expertise = lazy(() => import('./components/Expertise'));
const Timeline = lazy(() => import('./components/Timeline'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const SacruroDetails = lazy(() => import('./components/SacruroDetails'));
const PPGComputerVisionDetails = lazy(() => import('./components/PPGComputerVisionDetails'));

function DeferredSection({ children, minHeight = 320 }: { children: React.ReactNode; minHeight?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const element = ref.current;
        // Le menu demande de tout charger avant de défiler vers une section encore absente du DOM.
        const forceLoad = () => setShouldLoad(true);
        window.addEventListener('portfolio:preload', forceLoad);
        if (!element || typeof IntersectionObserver === 'undefined') {
            setShouldLoad(true);
            return () => window.removeEventListener('portfolio:preload', forceLoad);
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: '800px 0px' });
        observer.observe(element);
        return () => {
            observer.disconnect();
            window.removeEventListener('portfolio:preload', forceLoad);
        };
    }, []);

    return <div ref={ref} style={{ minHeight: shouldLoad ? undefined : minHeight }}>{shouldLoad && <Suspense fallback={null}>{children}</Suspense>}</div>;
}

const SITE_TITLE = 'Cédric Djohozin | Génie biomédical';
const PROJECT_TITLES: Record<string, string> = {
    'sacruro': 'SACRURO',
    'mor-eyes': 'MorEyesCommunicator (MEC)',
    'ppg-computer-vision': 'Rythme cardiaque par PPG et vision par ordinateur',
    'dicom-anonymizer': 'DICOM Anonymizer',
    'carte-donnees-biomedicales': 'Carte universelle de données biomédicales',
    'moyes-pro': 'Moyes Pro',
    'gmao-hospitaliere': 'GMAO hospitalière open source',
    'medura': 'MEDORA, assistant médical vocal',
    'emg-neuropathie-matlab': 'Analyse EMG de la neuropathie périphérique',
    'thermostat-solidworks': 'Thermostat – conception CAO'
};

function App() {
    const [mode, setMode] = useState<string>(() => {
        try {
            return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
        } catch {
            return 'dark';
        }
    });
    const [hash, setHash] = useState(window.location.hash);
    const isProjectPage = hash.startsWith('#/project/');
    const isSacruroPage = hash === '#/project/sacruro';
    const isPPGPage = hash === '#/project/ppg-computer-vision';

    // Le titre de l'onglet suit la page affichée (historique, favoris, lecteurs d'écran).
    useEffect(() => {
        const slug = hash.startsWith('#/project/') ? hash.replace('#/project/', '').split('?')[0] : '';
        const name = PROJECT_TITLES[slug];
        document.title = name ? `${name} | Cédric Djohozin` : SITE_TITLE;
    }, [hash]);

    const handleModeChange = () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        try { window.localStorage.setItem('portfolio-theme', next); } catch { /* stockage indisponible : on ignore */ }
    };

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return (
        <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
            {isProjectPage ? (
                <Suspense fallback={null}>
                    {isSacruroPage ? <SacruroDetails /> : isPPGPage ? <PPGComputerVisionDetails /> : <ProjectDetails />}
                </Suspense>
            ) : (
                <FadeIn transitionDuration={700}>
                    <HeroVideo />
                    <Main/>
                    <DeferredSection minHeight={520}><Expertise /></DeferredSection>
                    <DeferredSection minHeight={620}><Timeline /></DeferredSection>
                    <Project/>
                    <DeferredSection minHeight={640}><Gallery /></DeferredSection>
                    <DeferredSection minHeight={520}><Contact /></DeferredSection>
                </FadeIn>
            )}
            <Footer />
        </div>
    );
}

export default App;
