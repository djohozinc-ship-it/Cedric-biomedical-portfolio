/*
  Lieux de la carte « Mon parcours au Bénin ».

  Pour ajouter ou corriger un lieu : modifier cette liste (latitude / longitude en degrés décimaux).
  Les textes sont fournis dans les cinq langues ; le français sert de repli.
  Les dates et les intitulés reprennent ceux de la section « Parcours ».
*/

import { Tr } from '../i18n/LanguageContext';

export type PlaceEntry = {
    kind: 'study' | 'work';
    period: Tr;
    title: Tr;
    detail?: Tr;
};

export type Place = {
    id: string;
    name: Tr;
    short?: Tr;   // libellé court affiché sur la carte (le nom complet reste dans le panneau)
    lat: number;
    lon: number;
    labelSide: 'left' | 'right' | 'top';
    entries: PlaceEntry[];
};

const MENTION_TB: Tr = { fr: 'Mention Très Bien', en: 'Graduated with high distinction', tr: 'Pekiyi derece', zh: '成绩优异（Très Bien）', ru: 'С отличием (Très Bien)' };
const MENTION_B: Tr = { fr: 'Mention Bien', en: 'Graduated with distinction', tr: 'İyi derece', zh: '成绩良好（Bien）', ru: 'С хорошей оценкой (Bien)' };
const DEM: Tr = {
    fr: 'Direction des Équipements et de la Maintenance',
    en: 'Directorate of Equipment and Maintenance',
    tr: 'Ekipman ve Bakım Müdürlüğü',
    zh: '设备与维护管理处',
    ru: 'Дирекция оборудования и технического обслуживания',
};

// Ordre = ordre d'affichage des lieux ; à l'intérieur d'un lieu, du plus ancien au plus récent.
export const places: Place[] = [
    {
        id: 'bohicon',
        name: { fr: 'Bohicon', en: 'Bohicon', tr: 'Bohicon', zh: '博希孔', ru: 'Бохикон' },
        lat: 7.1783,
        lon: 2.0667,
        labelSide: 'top',
        entries: [
            {
                kind: 'study',
                period: { fr: '2021' },
                title: {
                    fr: 'Formation en Électronique et Électrotechnique — CFREE, Bohicon',
                    en: 'Training in Electronics and Electrical Engineering — CFREE, Bohicon',
                    tr: 'Elektronik ve Elektroteknik Eğitimi — CFREE, Bohicon',
                    zh: '电子与电气技术培训 — CFREE，博希孔',
                    ru: 'Обучение электронике и электротехнике — CFREE, Бохикон',
                },
            },
            {
                kind: 'work',
                period: { fr: '25/07/2022 – 01/09/2022' },
                title: { fr: 'Stage — SERIB', en: 'Internship — SERIB', tr: 'Staj — SERIB', zh: '实习 — SERIB', ru: 'Стажировка — SERIB' },
                detail: {
                    fr: 'Service de Rembobinage Industriel et de Bâtiment',
                    en: 'Industrial and Building Rewinding Service',
                    tr: 'Endüstriyel ve Yapı Sarım Hizmeti',
                    zh: '工业与建筑电机重绕服务部',
                    ru: 'Служба промышленной и строительной перемотки электродвигателей',
                },
            },
        ],
    },
    {
        id: 'porto-novo',
        name: { fr: 'Porto-Novo', en: 'Porto-Novo', tr: 'Porto-Novo', zh: '波多诺伏', ru: 'Порто-Ново' },
        lat: 6.4969,
        lon: 2.6289,
        labelSide: 'top',
        entries: [
            {
                kind: 'study',
                period: { fr: '2022' },
                title: {
                    fr: 'CAP Électricité — Lycée Technique et Professionnel de Porto-Novo',
                    en: 'CAP in Electricity — Technical and Vocational High School of Porto-Novo',
                    tr: 'Elektrik CAP — Porto-Novo Teknik ve Meslek Lisesi',
                    zh: '电工职业能力证书（CAP）— 波多诺伏技术与职业高中',
                    ru: 'CAP по электрике — Технический и профессиональный лицей Порто-Ново',
                },
                detail: MENTION_B,
            },
            {
                kind: 'study',
                period: { fr: '2023' },
                title: {
                    fr: 'Baccalauréat technique et DTI en Électrotechnique — Lycée Technique et Professionnel de Porto-Novo',
                    en: 'Technical Baccalaureate and DTI in Electrical Engineering — Technical and Vocational High School of Porto-Novo',
                    tr: 'Elektroteknik Teknik Bakalorya ve DTI — Porto-Novo Teknik ve Meslek Lisesi',
                    zh: '电气技术类业士学位与工业技术员文凭（DTI）— 波多诺伏技术与职业高中',
                    ru: 'Технический бакалавриат и DTI по электротехнике — Технический и профессиональный лицей Порто-Ново',
                },
                detail: {
                    fr: 'Baccalauréat : Mention Bien · DTI : Mention Très Bien',
                    en: 'Baccalaureate: distinction · DTI: high distinction',
                    tr: 'Bakalorya: iyi derece · DTI: pekiyi derece',
                    zh: '业士学位：成绩良好（Bien）· DTI：成绩优异（Très Bien）',
                    ru: 'Бакалавриат: с хорошей оценкой (Bien) · DTI: с отличием (Très Bien)',
                },
            },
        ],
    },
    {
        id: 'cove',
        name: { fr: 'Covè', en: 'Covè', tr: 'Covè', zh: '科韦', ru: 'Ковэ' },
        lat: 7.2167,
        lon: 2.3333,
        labelSide: 'right',
        entries: [
            {
                kind: 'work',
                period: { fr: '12/08/2024 – 06/09/2024' },
                title: {
                    fr: 'Stage — Hôpital de Zone de Covè',
                    en: 'Internship — Covè Zone Hospital',
                    tr: 'Staj — Covè Bölge Hastanesi',
                    zh: '实习 — 科韦区域医院',
                    ru: 'Стажировка — Зональная больница Ковэ',
                },
                detail: { fr: 'Service Biomédical', en: 'Biomedical Department', tr: 'Biyomedikal Birimi', zh: '生物医学部门', ru: 'Биомедицинская служба' },
            },
        ],
    },
    {
        id: 'abomey',
        name: { fr: 'Abomey', en: 'Abomey', tr: 'Abomey', zh: '阿波美', ru: 'Абомей' },
        lat: 7.1829,
        lon: 1.9912,
        labelSide: 'left',
        entries: [
            {
                kind: 'work',
                period: { fr: '11/08/2025 – 05/09/2025' },
                title: {
                    fr: 'Stage — Centre Hospitalier Départemental du Zou',
                    en: 'Internship — Zou Departmental Hospital Centre (CHD-Zou)',
                    tr: 'Staj — Zou Bölge Hastane Merkezi (CHD-Zou)',
                    zh: '实习 — 祖省省级医院中心（CHD-Zou）',
                    ru: 'Стажировка — Департаментский больничный центр Зу (CHD-Zou)',
                },
                detail: DEM,
            },
            {
                kind: 'work',
                period: { fr: '23/03/2026 – 12/06/2026' },
                title: {
                    fr: 'Stage — Centre Hospitalier Départemental du Zou',
                    en: 'Internship — Zou Departmental Hospital Centre (CHD-Zou)',
                    tr: 'Staj — Zou Bölge Hastane Merkezi (CHD-Zou)',
                    zh: '实习 — 祖省省级医院中心（CHD-Zou）',
                    ru: 'Стажировка — Департаментский больничный центр Зу (CHD-Zou)',
                },
                detail: DEM,
            },
            {
                kind: 'work',
                period: { fr: 'Depuis le 28/09/2026', en: 'Since 28/09/2026', tr: '28/09/2026’dan beri', zh: '自 2026年9月28日起', ru: 'С 28/09/2026' },
                title: {
                    fr: 'Bénévolat — Centre Hospitalier Départemental du Zou',
                    en: 'Volunteer — Zou Departmental Hospital Centre (CHD-Zou)',
                    tr: 'Gönüllü — Zou Bölge Hastane Merkezi (CHD-Zou)',
                    zh: '志愿者 — 祖省省级医院中心（CHD-Zou）',
                    ru: 'Волонтёр — Департаментский больничный центр Зу (CHD-Zou)',
                },
                detail: DEM,
            },
        ],
    },
    {
        id: 'abomey-calavi',
        name: { fr: 'Abomey-Calavi', en: 'Abomey-Calavi', tr: 'Abomey-Calavi', zh: '阿波美卡拉维', ru: 'Абомей-Калави' },
        lat: 6.4485,
        lon: 2.3557,
        labelSide: 'left',
        entries: [
            {
                kind: 'study',
                period: { fr: '2026' },
                title: {
                    fr: 'Licence professionnelle en Maintenance Biomédicale et Hospitalière — EPAC',
                    en: 'Professional Bachelor’s Degree in Biomedical and Hospital Maintenance — EPAC',
                    tr: 'Biyomedikal ve Hastane Bakımı Mesleki Lisans Derecesi — EPAC',
                    zh: '生物医学与医院设备维护专业学士学位 — EPAC',
                    ru: 'Профессиональный бакалавриат по биомедицинскому и больничному обслуживанию — EPAC',
                },
                detail: MENTION_TB,
            },
        ],
    },
];
