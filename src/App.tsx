import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  Navigation,
  Footer,
} from "./components";
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

    const handleModeChange = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        <FadeIn transitionDuration={700}>
            <BiomedicalCityViewport />
            <Main/>
            <Expertise/>
            <Timeline/>
            <Project/>
            <Contact/>
        </FadeIn>
        <Footer />
    </div>
    );
}

export default App;