import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Main from "./components/Main";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HeroVideo from './components/HeroVideo';
import Project from "./components/Project";
import FadeIn from './components/FadeIn';
import { LanguageProvider, Tr, useLanguage } from './i18n/LanguageContext';
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

const SITE_TITLE: Tr = {
    fr: 'Cédric Djohozin | Génie biomédical',
    en: 'Cédric Djohozin | Biomedical Engineering',
    tr: 'Cédric Djohozin | Biyomedikal Mühendisliği',
    zh: 'Cédric Djohozin | 生物医学工程',
    ru: 'Cédric Djohozin | Биомедицинская инженерия'
};
const PROJECT_TITLES: Record<string, Tr> = {
    'sacruro': { fr: 'SACRURO' },
    'mor-eyes': { fr: 'MorEyesCommunicator (MEC)' },
    'ppg-computer-vision': {
        fr: 'Rythme cardiaque par PPG et vision par ordinateur',
        en: 'Heart rate from PPG and computer vision',
        tr: 'PPG ve bilgisayarlı görü ile kalp atış hızı',
        zh: '基于PPG与计算机视觉的心率检测',
        ru: 'Измерение пульса по PPG и компьютерное зрение'
    },
    'dicom-anonymizer': { fr: 'DICOM Anonymizer' },
    'carte-donnees-biomedicales': {
        fr: 'Carte universelle de données biomédicales',
        en: 'Universal biomedical data card',
        tr: 'Evrensel biyomedikal veri kartı',
        zh: '通用生物医学数据卡',
        ru: 'Универсальная карта биомедицинских данных'
    },
    'moyes-pro': { fr: 'Moyes Pro' },
    'gmao-hospitaliere': {
        fr: 'GMAO hospitalière open source',
        en: 'Open-source hospital CMMS',
        tr: 'Açık kaynaklı hastane bakım yönetim yazılımı (CMMS)',
        zh: '开源医院设备维护管理系统（CMMS）',
        ru: 'Открытая система управления обслуживанием (CMMS) для больниц'
    },
    'medura': {
        fr: 'MEDORA, assistant médical vocal',
        en: 'MEDORA, voice medical assistant',
        tr: 'MEDORA, sesli tıbbi asistan',
        zh: 'MEDORA：语音医疗助手',
        ru: 'MEDORA — голосовой медицинский помощник'
    },
    'emg-neuropathie-matlab': {
        fr: 'Analyse EMG de la neuropathie périphérique',
        en: 'EMG analysis of peripheral neuropathy',
        tr: 'Periferik nöropatinin EMG analizi',
        zh: '周围神经病变的肌电图（EMG）分析',
        ru: 'ЭМГ-анализ периферической нейропатии'
    },
    'thermostat-solidworks': {
        fr: 'Thermostat – conception CAO',
        en: 'Thermostat – CAD design',
        tr: 'Termostat – CAD tasarımı',
        zh: '恒温器——CAD设计',
        ru: 'Термостат — САПР-проектирование'
    }
};

function AppContent() {
    const { t } = useLanguage();
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
        document.title = name ? `${t(name)} | Cédric Djohozin` : t(SITE_TITLE);
    }, [hash, t]);

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

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;
