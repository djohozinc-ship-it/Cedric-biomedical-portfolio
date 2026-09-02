import React, { Suspense, useEffect, useRef, useState } from "react";
import Main from "./components/Main";
import Timeline from "./components/Timeline";
import Expertise from "./components/Expertise";
import Project from "./components/Project";
import ProjectDetails from "./components/ProjectDetails";
import Contact from "./components/Contact";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import FadeIn from './components/FadeIn';
import './index.scss';

const BiomedicalCity = React.lazy(() => import('./components/BiomedicalCity'));

function BiomedicalCityViewport() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const element = viewportRef.current;

        if (!element || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {rootMargin: '400px 0px'}
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={viewportRef} className="biomedical-city-viewport">
            {isVisible && (
                <Suspense fallback={null}>
                    <BiomedicalCity />
                </Suspense>
            )}
        </div>
    );
}

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [hash, setHash] = useState(window.location.hash);
    const isProjectPage = hash.startsWith('#/project/');

    const handleModeChange = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash);
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        {isProjectPage ? (
            <ProjectDetails />
        ) : (
            <FadeIn transitionDuration={700}>
                <BiomedicalCityViewport />
                <Main/>
                <Expertise/>
                <Timeline/>
                <Project/>
                <Contact/>
            </FadeIn>
        )}
        <Footer />
    </div>
    );
}

export default App;
