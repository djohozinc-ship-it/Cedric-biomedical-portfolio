import React, { useState } from 'react';
import '../assets/styles/BeninMap.scss';
import { Tr, useLanguage } from '../i18n/LanguageContext';
import { INSET_FRAME, INSET_VIEW, MAIN_VIEW, project } from '../data/beninMap';
import { places } from '../data/beninPlaces';

const L: Record<string, Tr> = {
    title: { fr: 'Mon parcours au Bénin', en: 'My journey across Benin', tr: 'Benin’deki yolculuğum', zh: '我在贝宁的足迹', ru: 'Мой путь по Бенину' },
    intro: {
        fr: 'Les lieux où je me suis formé et où j’ai travaillé. Touchez un repère pour voir les détails.',
        en: 'The places where I trained and worked. Select a marker to see the details.',
        tr: 'Eğitim aldığım ve çalıştığım yerler. Ayrıntıları görmek için bir işarete dokunun.',
        zh: '我学习和工作过的地方。点击地图上的标记查看详情。',
        ru: 'Места, где я учился и работал. Выберите отметку, чтобы увидеть подробности.',
    },
    mapLabel: {
        fr: 'Carte du sud du Bénin avec les lieux de formation et de stage',
        en: 'Map of southern Benin showing training and internship places',
        tr: 'Eğitim ve staj yerlerini gösteren güney Benin haritası',
        zh: '贝宁南部地图，标出学习和实习地点',
        ru: 'Карта юга Бенина с местами учёбы и стажировок',
    },
    insetLabel: { fr: 'Situation dans le Bénin', en: 'Location within Benin', tr: 'Benin içindeki konum', zh: '在贝宁的位置', ru: 'Положение в Бенине' },
    gulf: { fr: 'Golfe de Guinée', en: 'Gulf of Guinea', tr: 'Gine Körfezi', zh: '几内亚湾', ru: 'Гвинейский залив' },
    benin: { fr: 'BÉNIN', en: 'BENIN', tr: 'BENİN', zh: '贝宁', ru: 'БЕНИН' },
    togo: { fr: 'TOGO', en: 'TOGO', tr: 'TOGO', zh: '多哥', ru: 'ТОГО' },
    nigeria: { fr: 'NIGÉRIA', en: 'NIGERIA', tr: 'NİJERYA', zh: '尼日利亚', ru: 'НИГЕРИЯ' },
    study: { fr: 'Formation', en: 'Education', tr: 'Eğitim', zh: '学业', ru: 'Образование' },
    work: { fr: 'Expérience', en: 'Experience', tr: 'Deneyim', zh: '经历', ru: 'Опыт' },
    places: { fr: 'Lieux', en: 'Places', tr: 'Yerler', zh: '地点', ru: 'Места' },
};

function BeninMap() {
    const { t } = useLanguage();
    const [selectedId, setSelectedId] = useState<string>(places[0].id);
    const selected = places.find((place) => place.id === selectedId) ?? places[0];

    return (
        <div className="benin-map-container" id="map">
            <header className="bm-heading">
                <h1 aria-level={2}>{t(L.title)}</h1>
                <p>{t(L.intro)}</p>
            </header>

            <div className="bm-layout">
                <div className="bm-map" style={{ aspectRatio: `${MAIN_VIEW.width} / ${MAIN_VIEW.height}` }}>
                    <svg
                        className="bm-svg"
                        viewBox={`0 0 ${MAIN_VIEW.width} ${MAIN_VIEW.height}`}
                        role="img"
                        aria-label={t(L.mapLabel)}
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <rect className="bm-sea" width={MAIN_VIEW.width} height={MAIN_VIEW.height} />
                        <path className="bm-land" d={MAIN_VIEW.paths.TGO} />
                        <path className="bm-land" d={MAIN_VIEW.paths.NGA} />
                        <path className="bm-benin" d={MAIN_VIEW.paths.BEN} />
                        <text className="bm-country bm-country--benin" x={MAIN_VIEW.width * 0.5} y={MAIN_VIEW.height * 0.12} textAnchor="middle">{t(L.benin)}</text>
                        <text className="bm-country" x={MAIN_VIEW.width * 0.06} y={MAIN_VIEW.height * 0.5} textAnchor="start">{t(L.togo)}</text>
                        <text className="bm-country" x={MAIN_VIEW.width * 0.95} y={MAIN_VIEW.height * 0.5} textAnchor="end">{t(L.nigeria)}</text>
                        <text className="bm-sea-label" x={MAIN_VIEW.width * 0.5} y={MAIN_VIEW.height * 0.94} textAnchor="middle">{t(L.gulf)}</text>
                    </svg>

                    {places.map((place) => {
                        const { x, y } = project(MAIN_VIEW, place.lat, place.lon);
                        const active = place.id === selectedId;
                        return (
                            <button
                                key={place.id}
                                type="button"
                                className={`bm-marker bm-marker--${place.labelSide}${active ? ' is-active' : ''}`}
                                style={{ left: `${(x / MAIN_VIEW.width) * 100}%`, top: `${(y / MAIN_VIEW.height) * 100}%` }}
                                onClick={() => setSelectedId(place.id)}
                                aria-pressed={active}
                                aria-label={t(place.name)}
                            >
                                <span className="bm-dot" aria-hidden="true" />
                                <span className="bm-marker-label">{t(place.short ?? place.name)}</span>
                            </button>
                        );
                    })}

                    <figure className="bm-inset">
                        <svg
                            viewBox={`0 0 ${INSET_VIEW.width} ${INSET_VIEW.height}`}
                            role="img"
                            aria-label={t(L.insetLabel)}
                        >
                            <path className="bm-inset-land" d={INSET_VIEW.paths.BEN} />
                            <rect className="bm-inset-frame" x={INSET_FRAME.x} y={INSET_FRAME.y} width={INSET_FRAME.width} height={INSET_FRAME.height} />
                        </svg>
                    </figure>
                </div>

                <section className="bm-panel" aria-live="polite" aria-label={t(selected.name)}>
                    <div className="bm-tabs" role="group" aria-label={t(L.places)}>
                        {places.map((place) => (
                            <button
                                key={place.id}
                                type="button"
                                className="bm-tab"
                                aria-pressed={place.id === selectedId}
                                onClick={() => setSelectedId(place.id)}
                            >
                                {t(place.name)}
                            </button>
                        ))}
                    </div>

                    <h2 className="bm-place-name">{t(selected.name)}</h2>
                    <ol className="bm-entries">
                        {selected.entries.map((entry, index) => (
                            <li key={index} className={`bm-entry bm-entry--${entry.kind}`}>
                                <span className="bm-entry-meta">
                                    <span className="bm-entry-kind">{t(L[entry.kind])}</span>
                                    <span className="bm-entry-period">{t(entry.period)}</span>
                                </span>
                                <span className="bm-entry-title">{t(entry.title)}</span>
                                {entry.detail && <span className="bm-entry-detail">{t(entry.detail)}</span>}
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    );
}

export default BeninMap;
