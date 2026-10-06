import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Main from "./components/Main";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Project from "./components/Project";
import FadeIn from './components/FadeIn';
import './index.scss';
import './components/SacruroImages.scss';
import './assets/styles/MorEyesFixes.scss';

const BiomedicalCity = lazy(() => import('./components/BiomedicalFutureScene'));
const Expertise = lazy(() => import('./components/Expertise'));
const Timeline = lazy(() => import('./components/Timeline'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const SacruroDetails = lazy(() => import('./components/SacruroDetails'));
const PPGComputerVisionDetails = lazy(() => import('./components/PPGComputerVisionDetails'));
const MorEyesDetails = lazy(() => import('./components/MorEyesDetails'));

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

function BiomedicalCityViewport() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setIsReady(true), 1200);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;
        const element = viewportRef.current;
        if (!element || typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '100px 0px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, [isReady]);

    return <div ref={viewportRef} className="biomedical-city-viewport">{isReady && isVisible && <Suspense fallback={null}><BiomedicalCity /></Suspense>}</div>;
}

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
    const isMorEyesPage = hash === '#/project/mor-eyes';

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

    // Les ancres internes de MOR-EYES ne doivent pas être interprétées comme des routes React.
    // Elles font défiler la page sans quitter la fiche projet.
    useEffect(() => {
        if (!isMorEyesPage) return;

        const handleMorEyesAnchors = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const link = target?.closest<HTMLAnchorElement>('.mor-eyes-actions a[href^="#mor-eyes-"]');
            if (!link) return;

            const id = link.getAttribute('href')?.slice(1);
            if (!id) return;

            const destination = document.getElementById(id);
            if (!destination) return;

            event.preventDefault();
            destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        document.addEventListener('click', handleMorEyesAnchors);
        return () => document.removeEventListener('click', handleMorEyesAnchors);
    }, [isMorEyesPage]);

    return (
        <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
            {isProjectPage ? (
                <Suspense fallback={null}>
                    {isSacruroPage ? <SacruroDetails /> : isPPGPage ? <PPGComputerVisionDetails /> : isMorEyesPage ? <MorEyesDetails /> : <ProjectDetails />}
                </Suspense>
            ) : (
                <FadeIn transitionDuration={700}>
                    <BiomedicalCityViewport />
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
