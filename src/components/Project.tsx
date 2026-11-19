import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import osmoseurImage from '../assets/images/sacruro/chd-zou-osmoseur.jpg';
import '../assets/styles/Project.scss';
import { Tr, useLanguage } from '../i18n/LanguageContext';

const publicUrl = process.env.PUBLIC_URL || '';

type FeaturedProject = {
    slug: string;
    title: Tr;
    summary: Tr;
    image: string;
    alt: Tr;
    width: number;
    height: number;
    facts: { label: Tr; value: Tr }[];
};

type ShortProject = { slug: string; title: Tr; summary: Tr; tags: string };

const L_DOMAIN: Tr = { fr: 'Domaine', en: 'Field', tr: 'Alan', zh: '领域', ru: 'Область' };
const L_STATUS: Tr = { fr: 'Statut', en: 'Status', tr: 'Durum', zh: '状态', ru: 'Статус' };
const L_TECH: Tr = { fr: 'Technologies', en: 'Technologies', tr: 'Teknolojiler', zh: '技术', ru: 'Технологии' };

// Les trois projets documentés en détail : photo réelle + fiche (domaine, statut, technologies).
const featuredProjects: FeaturedProject[] = [
    {
        slug: 'sacruro',
        title: { fr: 'SACRURO' },
        summary: {
            fr: 'Récupérer et valoriser le concentrat rejeté par l’osmoseur d’une unité de dialyse, pour des usages non potables.',
            en: 'Recovering and reusing the concentrate rejected by the reverse-osmosis unit of a dialysis department, for non-potable uses.',
            tr: 'Bir diyaliz ünitesindeki ters ozmoz cihazının attığı konsantreyi geri kazanmak ve içilemez kullanımlar için değerlendirmek.',
            zh: '回收并再利用透析科反渗透装置排出的浓水，用于非饮用用途。',
            ru: 'Сбор и повторное использование концентрата, сбрасываемого установкой обратного осмоса отделения диализа, для непитьевых целей.'
        },
        image: osmoseurImage,
        alt: {
            fr: 'Osmoseur et cuves de traitement d’eau de l’unité de dialyse du CHD-Zou',
            en: 'Reverse-osmosis unit and water treatment tanks of the CHD-Zou dialysis department',
            tr: 'CHD-Zou diyaliz ünitesinin ters ozmoz cihazı ve su arıtma tankları',
            zh: 'CHD-Zou 透析科的反渗透装置与水处理水箱',
            ru: 'Установка обратного осмоса и резервуары водоподготовки отделения диализа CHD-Zou'
        },
        width: 1800,
        height: 1350,
        facts: [
            { label: L_DOMAIN, value: { fr: 'Génie biomédical, IoT, gestion de l’eau', en: 'Biomedical engineering, IoT, water management', tr: 'Biyomedikal mühendislik, IoT, su yönetimi', zh: '生物医学工程、物联网、水资源管理', ru: 'Биомедицинская инженерия, IoT, управление водой' } },
            { label: L_STATUS, value: { fr: 'Mémoire en binôme : étude de conception et prototype de supervision', en: 'Joint thesis project: design study and monitoring prototype', tr: 'İkili bitirme tezi: tasarım çalışması ve izleme prototipi', zh: '双人毕业论文：设计研究与监控原型', ru: 'Дипломная работа в паре: проектное исследование и прототип системы мониторинга' } },
            { label: L_TECH, value: { fr: 'ESP32, MQTT, React Native, KiCad' } }
        ]
    },
    {
        slug: 'mor-eyes',
        title: { fr: 'MorEyesCommunicator (MEC)' },
        summary: {
            fr: 'Un système de suppléance oratoire : la vision artificielle transforme des clignements volontaires en commandes, puis en parole.',
            en: 'A speech-assistance system: computer vision turns voluntary blinks into commands, then into speech.',
            tr: 'Bir konuşma destek sistemi: bilgisayarlı görü, isteyerek yapılan göz kırpmaları komutlara, ardından konuşmaya dönüştürür.',
            zh: '一种辅助发声系统：机器视觉将自主眨眼转换为指令，再转换为语音。',
            ru: 'Система речевой поддержки: компьютерное зрение превращает намеренные моргания в команды, а затем в речь.'
        },
        image: `${publicUrl}/images/projects/mor-eyes/hero.jpg`,
        alt: {
            fr: 'Prototype MOR-EYES devant l’interface du logiciel de communication',
            en: 'MOR-EYES prototype in front of the communication software interface',
            tr: 'İletişim yazılımının arayüzü önündeki MOR-EYES prototipi',
            zh: 'MOR-EYES 原型与通信软件界面',
            ru: 'Прототип MOR-EYES перед интерфейсом коммуникационного ПО'
        },
        width: 1080,
        height: 797,
        facts: [
            { label: L_DOMAIN, value: { fr: 'Technologie d’assistance', en: 'Assistive technology', tr: 'Yardımcı teknoloji', zh: '辅助技术', ru: 'Вспомогательные технологии' } },
            { label: L_STATUS, value: { fr: 'Prototype fonctionnel V1.0', en: 'Working prototype V1.0', tr: 'Çalışan prototip V1.0', zh: '可运行原型 V1.0', ru: 'Рабочий прототип V1.0' } },
            { label: L_TECH, value: { fr: 'Python, OpenCV, MediaPipe, pyttsx3' } }
        ]
    },
    {
        slug: 'ppg-computer-vision',
        title: {
            fr: 'Rythme cardiaque par PPG et vision par ordinateur',
            en: 'Heart rate from PPG and computer vision',
            tr: 'PPG ve bilgisayarlı görü ile kalp atış hızı',
            zh: '基于PPG与计算机视觉的心率检测',
            ru: 'Измерение пульса по PPG и компьютерное зрение'
        },
        summary: {
            fr: 'Une méthode sans contact pour estimer le rythme cardiaque à partir d’une vidéo du visage.',
            en: 'A contactless method to estimate heart rate from a video of the face.',
            tr: 'Yüz videosundan kalp atış hızını temassız olarak tahmin eden bir yöntem.',
            zh: '一种通过面部视频非接触式估算心率的方法。',
            ru: 'Бесконтактный метод оценки пульса по видео лица.'
        },
        image: `${publicUrl}/images/projects/ppg/signal-ppg-brut.jpg`,
        alt: {
            fr: 'Capture de l’expérimentation : zone du visage analysée et signal PPG brut',
            en: 'Screenshot of the experiment: analyzed face region and raw PPG signal',
            tr: 'Deneyden ekran görüntüsü: analiz edilen yüz bölgesi ve ham PPG sinyali',
            zh: '实验截图：被分析的面部区域与原始PPG信号',
            ru: 'Снимок эксперимента: анализируемая область лица и необработанный PPG-сигнал'
        },
        width: 1920,
        height: 1080,
        facts: [
            { label: L_DOMAIN, value: { fr: 'Traitement du signal, santé', en: 'Signal processing, healthcare', tr: 'Sinyal işleme, sağlık', zh: '信号处理、医疗健康', ru: 'Обработка сигналов, здравоохранение' } },
            { label: L_STATUS, value: { fr: 'Prototype expérimental', en: 'Experimental prototype', tr: 'Deneysel prototip', zh: '实验性原型', ru: 'Экспериментальный прототип' } },
            { label: L_TECH, value: { fr: 'Python, OpenCV, MediaPipe, SciPy' } }
        ]
    }
];

const shortProjects: ShortProject[] = [
    {
        slug: 'dicom-anonymizer',
        title: { fr: 'DICOM Anonymizer' },
        summary: {
            fr: 'Exploration, contrôle et anonymisation d’une série d’images CT au format DICOM.',
            en: 'Exploring, checking and anonymizing a series of CT images in DICOM format.',
            tr: 'DICOM biçimindeki bir BT görüntü serisinin incelenmesi, kontrolü ve anonimleştirilmesi.',
            zh: '对DICOM格式CT图像序列进行浏览、检查与匿名化处理。',
            ru: 'Просмотр, проверка и анонимизация серии КТ-изображений в формате DICOM.'
        },
        tags: 'Python, pydicom'
    },
    {
        slug: 'medura',
        title: {
            fr: 'MEDORA : assistant médical vocal',
            en: 'MEDORA: voice medical assistant',
            tr: 'MEDORA: sesli tıbbi asistan',
            zh: 'MEDORA：语音医疗助手',
            ru: 'MEDORA: голосовой медицинский помощник'
        },
        summary: {
            fr: 'Assistant vocal : interface web, voix Piper locale, ESP32 et casque Bluetooth.',
            en: 'Voice assistant: web interface, local Piper voice, ESP32 and Bluetooth headset.',
            tr: 'Sesli asistan: web arayüzü, yerel Piper sesi, ESP32 ve Bluetooth kulaklık.',
            zh: '语音助手：网页界面、本地 Piper 语音、ESP32 与蓝牙耳机。',
            ru: 'Голосовой помощник: веб-интерфейс, локальный голос Piper, ESP32 и Bluetooth-гарнитура.'
        },
        tags: 'Python, ESP32, Piper'
    },
    {
        slug: 'emg-neuropathie-matlab',
        title: {
            fr: 'Analyse EMG de la neuropathie',
            en: 'EMG analysis of neuropathy',
            tr: 'Nöropatinin EMG analizi',
            zh: '神经病变的肌电图（EMG）分析',
            ru: 'ЭМГ-анализ нейропатии'
        },
        summary: {
            fr: 'Filtrage et analyse spectrale de signaux EMG normal et pathologique sous MATLAB.',
            en: 'Filtering and spectral analysis of normal and pathological EMG signals in MATLAB.',
            tr: "MATLAB'de normal ve patolojik EMG sinyallerinin filtrelenmesi ve spektral analizi.",
            zh: '在 MATLAB 中对正常与病理肌电信号进行滤波和频谱分析。',
            ru: 'Фильтрация и спектральный анализ нормального и патологического ЭМГ-сигналов в MATLAB.'
        },
        tags: 'MATLAB, EMG, FFT'
    },
];

function Project() {
    const { t } = useLanguage();
    useEffect(() => {
        let savedPosition: string | null = null;
        try { savedPosition = sessionStorage.getItem('projects-scroll-position'); } catch { /* stockage indisponible */ }
        if (savedPosition === null) return;
        const position = Number(savedPosition);
        if (!Number.isFinite(position)) return;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: position, left: 0, behavior: 'auto' });
                try { sessionStorage.removeItem('projects-scroll-position'); } catch { /* ignore */ }
            });
        });
    }, []);

    // On mémorise la position pour la retrouver au retour depuis la fiche.
    const rememberPosition = () => {
        try { sessionStorage.setItem('projects-scroll-position', String(window.scrollY)); } catch { /* ignore */ }
    };

    const renderFeatured = (project: FeaturedProject, className: string) => (
        <article className={`pj-card ${className}`} key={project.slug}>
            <div className="pj-media">
                <img src={project.image} alt={t(project.alt)} width={project.width} height={project.height} loading="lazy" decoding="async" />
            </div>
            <div className="pj-body">
                <h2 className="pj-title">
                    <a href={`#/project/${project.slug}`} onClick={rememberPosition}>{t(project.title)}</a>
                </h2>
                <p className="pj-summary">{t(project.summary)}</p>
                <dl className="pj-facts">
                    {project.facts.map((fact) => (
                        <div key={fact.label.fr}>
                            <dt>{t(fact.label)}</dt>
                            <dd>{t(fact.value)}</dd>
                        </div>
                    ))}
                </dl>
                <span className="pj-cta" aria-hidden="true">{t({ fr: 'Voir le projet', en: 'View project', tr: 'Projeyi gör', zh: '查看项目', ru: 'Смотреть проект' })}</span>
            </div>
        </article>
    );

    return (
        <div className="projects-container" id="projects">
            <header className="projects-heading">
                <h1 aria-level={2}>{t({ fr: 'Projets', en: 'Projects', tr: 'Projeler', zh: '项目', ru: 'Проекты' })}</h1>
                <p>{t({ fr: 'Trois projets présentés en détail, puis des réalisations plus courtes.', en: 'Three projects presented in detail, followed by shorter achievements.', tr: 'Ayrıntılı olarak sunulan üç proje ve ardından daha kısa çalışmalar.', zh: '三个详细介绍的项目，以及一些较简短的作品。', ru: 'Три подробно описанных проекта и несколько более коротких работ.' })}</p>
            </header>

            {renderFeatured(featuredProjects[0], 'pj-feature')}

            <div className="pj-pair">
                {featuredProjects.slice(1).map((project) => renderFeatured(project, 'pj-secondary'))}
            </div>

            <section className="pj-more" aria-labelledby="pj-more-title">
                <h2 id="pj-more-title">{t({ fr: 'Autres réalisations', en: 'Other work', tr: 'Diğer çalışmalar', zh: '其他作品', ru: 'Другие работы' })}</h2>
                <ul>
                    {shortProjects.map((project) => (
                        <li key={project.slug}>
                            <a className="pj-row" href={`#/project/${project.slug}`} onClick={rememberPosition}>
                                <span className="pj-row-title">{t(project.title)}</span>
                                <span className="pj-row-summary">{t(project.summary)}</span>
                                <span className="pj-row-tags">{project.tags}</span>
                                <FontAwesomeIcon className="pj-row-icon" icon={faChevronRight} aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Project;
