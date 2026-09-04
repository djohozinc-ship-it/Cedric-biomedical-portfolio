import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Main from "./components/Main";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Project from "./components/Project";
import FadeIn from './components/FadeIn';
import './index.scss';
import './components/SacruroImages.scss';

const BiomedicalCity = lazy(() => import('./components/BiomedicalFutureScene'));
const Expertise = lazy(() => import('./components/Expertise'));
const Timeline = lazy(() => import('./components/Timeline'));
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
        if (!element || typeof IntersectionObserver === 'undefined') {
            setShouldLoad(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: '800px 0px' });
        observer.observe(element);
        return () => observer.disconnect();
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

function sanitizeSacruroVisitorCopy() {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.sacruro-page .sacruro-section'));
    const setHeading = (section: HTMLElement | undefined, title: string) => {
        const heading = section?.querySelector('h2');
        if (!heading) return;
        const icon = heading.querySelector('svg');
        heading.replaceChildren();
        if (icon) heading.appendChild(icon);
        heading.appendChild(document.createTextNode(` ${title}`));
    };

    const synthesis = sections[29];
    setHeading(synthesis, 'Synthèse des apports');
    const synthesisText = synthesis?.querySelector('.sacruro-highlight p');
    if (synthesisText) {
        synthesisText.textContent = 'SACRURO met en œuvre une démarche d’ingénierie multidisciplinaire appliquée à un problème concret de gestion de l’eau en milieu hospitalier. L’étude articule mesures de terrain, caractérisation de l’eau, conception hydraulique, électronique, automatisation, IoT, sécurité, gestion des risques, maintenance et évaluation économique.';
    }

    const summary = sections[31];
    setHeading(summary, 'Résumé du projet');

    const demonstration = sections[32];
    const placeholderNote = demonstration?.querySelector('.sacruro-video-placeholder span');
    const placeholderFile = demonstration?.querySelector('.sacruro-video-placeholder small');
    if (placeholderNote) placeholderNote.remove();
    if (placeholderFile) placeholderFile.remove();
}

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [hash, setHash] = useState(window.location.hash);
    const isProjectPage = hash.startsWith('#/project/');
    const isSacruroPage = hash === '#/project/sacruro';
    const isPPGPage = hash === '#/project/ppg-computer-vision';
    const isMorEyesPage = hash === '#/project/mor-eyes';

    const handleModeChange = () => setMode(mode === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        if (!isSacruroPage) return;
        const timer = window.setTimeout(() => sanitizeSacruroVisitorCopy(), 120);
        return () => window.clearTimeout(timer);
    }, [isSacruroPage]);

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
                    <DeferredSection minHeight={520}><Contact /></DeferredSection>
                </FadeIn>
            )}
            <Footer />
        </div>
    );
}

export default App;
