import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faStethoscope, faScrewdriverWrench, faRobot } from '@fortawesome/free-solid-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';
import { Tr, useLanguage } from '../i18n/LanguageContext';

const biomedicalSkills: Tr[] = [
    { fr: "Maintenance préventive", en: "Preventive maintenance", tr: "Önleyici bakım", zh: "预防性维护", ru: "Профилактическое обслуживание" },
    { fr: "Maintenance corrective", en: "Corrective maintenance", tr: "Düzeltici bakım", zh: "纠正性维护", ru: "Корректирующее обслуживание" },
    { fr: "Diagnostic et recherche de pannes", en: "Diagnostics and troubleshooting", tr: "Arıza teşhisi ve arıza arama", zh: "故障诊断与排查", ru: "Диагностика и поиск неисправностей" },
    { fr: "Installation de dispositifs médicaux", en: "Installation of medical devices", tr: "Tıbbi cihaz kurulumu", zh: "医疗设备安装", ru: "Монтаж медицинских изделий" },
    { fr: "Mise en service", en: "Commissioning", tr: "Devreye alma", zh: "设备调试与投入使用", ru: "Ввод в эксплуатацию" },
    { fr: "Suivi des équipements hospitaliers", en: "Hospital equipment tracking", tr: "Hastane ekipmanlarının takibi", zh: "医院设备跟踪管理", ru: "Контроль больничного оборудования" },
    { fr: "Formation Utilisateur", en: "User training", tr: "Kullanıcı eğitimi", zh: "用户培训", ru: "Обучение пользователей" },
    { fr: "Maitrise des outils GMAO", en: "CMMS tools proficiency", tr: "Bakım yönetim yazılımı (CMMS) kullanımı", zh: "熟练使用CMMS（设备维护管理）工具", ru: "Владение системами CMMS (ТОиР)" },
    {
        fr: "Inventaire et réalisation de l'audit d'un service de maintenance",
        en: "Inventory and audit of a maintenance department",
        tr: "Bir bakım biriminin envanteri ve denetimi",
        zh: "维护部门的盘点与审计",
        ru: "Инвентаризация и аудит службы технического обслуживания"
    }
];

const electronicsSkills: Tr[] = [
    { fr: "Électronique", en: "Electronics", tr: "Elektronik", zh: "电子技术", ru: "Электроника" },
    { fr: "Électrotechnique", en: "Electrical engineering", tr: "Elektroteknik", zh: "电气技术", ru: "Электротехника" },
    { fr: "Câblage industriel", en: "Industrial wiring", tr: "Endüstriyel kablolama", zh: "工业布线", ru: "Промышленный монтаж проводки" },
    {
        fr: "Conception de schémas électroniques et électrique",
        en: "Design of electronic and electrical schematics",
        tr: "Elektronik ve elektrik şemalarının tasarımı",
        zh: "电子与电气原理图设计",
        ru: "Разработка электронных и электрических схем"
    },
    { fr: "Réalisation de PCB", en: "PCB design", tr: "Baskılı devre (PCB) tasarımı", zh: "PCB设计与制作", ru: "Разработка печатных плат (PCB)" },
    { fr: "Moteurs électriques", en: "Electric motors", tr: "Elektrik motorları", zh: "电动机", ru: "Электродвигатели" },
    { fr: "Systèmes photovoltaïques", en: "Photovoltaic systems", tr: "Fotovoltaik sistemler", zh: "光伏系统", ru: "Фотоэлектрические системы" }
];

const roboticsSkills: Tr[] = [
    { fr: "Instrumentation biomédicale", en: "Biomedical instrumentation", tr: "Biyomedikal enstrümantasyon", zh: "生物医学仪器", ru: "Биомедицинское приборостроение" },
    { fr: "ROS / ROS 2" },
    { fr: "Python & C++", en: "Python & C++", tr: "Python ve C++", zh: "Python 与 C++", ru: "Python и C++" },
    { fr: "OpenCV" },
    { fr: "Systèmes embarqués", en: "Embedded systems", tr: "Gömülü sistemler", zh: "嵌入式系统", ru: "Встраиваемые системы" },
    { fr: "Cinématique et commande de moteurs", en: "Kinematics and motor control", tr: "Kinematik ve motor kontrolü", zh: "运动学与电机控制", ru: "Кинематика и управление двигателями" },
    { fr: "Acquisition et traitement du signal", en: "Signal acquisition and processing", tr: "Sinyal toplama ve işleme", zh: "信号采集与处理", ru: "Сбор и обработка сигналов" }
];

// Noms d'outils : identiques dans toutes les langues.
const tools = [
    "KiCad",
    "Proteus",
    "SolidWorks",
    "Arduino IDE",
    "VS Code",
    "Fusion",
    "MATLAB",
    "Octave",
    "Blender",
    "github"
];

function Expertise() {
    const { t } = useLanguage();
    const skillsTitle = t({ fr: 'Compétences :', en: 'Skills:', tr: 'Beceriler:', zh: '技能：', ru: 'Навыки:' });
    const toolsTitle = t({ fr: 'Outils maîtrisés :', en: 'Tools I use:', tr: 'Kullandığım araçlar:', zh: '熟练使用的工具：', ru: 'Освоенные инструменты:' });

    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1 aria-level={2}>{t({ fr: 'Expertise', en: 'Expertise', tr: 'Uzmanlık', zh: '专业能力', ru: 'Экспертиза' })}</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faStethoscope} size="3x"/>
                    <h3>{t({ fr: 'Maintenance biomédicale', en: 'Biomedical maintenance', tr: 'Biyomedikal bakım', zh: '生物医学设备维护', ru: 'Биомедицинское обслуживание' })}</h3>
                    <p>
                        {t({
                            fr: "Compétences pratiques développées au cours de ma formation et de mes stages en milieu hospitalier. Maintient en exploitation optimal et sécuritaire du plateau technique hospitalier, avec une approche préventive et orientée vers la maintenance 4.0",
                            en: "Practical skills developed during my training and my hospital internships. Keeping the hospital's technical facilities running optimally and safely, with a preventive approach geared toward maintenance 4.0.",
                            tr: "Eğitimim ve hastane stajlarım sırasında geliştirdiğim pratik beceriler. Hastanenin teknik altyapısının en uygun ve güvenli şekilde çalışmasını, önleyici ve bakım 4.0 odaklı bir yaklaşımla sağlıyorum.",
                            zh: "在学习和医院实习期间积累的实践技能。以预防性、面向“维护4.0”的方式，保障医院技术平台安全、高效地运行。",
                            ru: "Практические навыки, полученные во время обучения и стажировок в больницах. Обеспечение оптимальной и безопасной работы технической базы больницы с профилактическим подходом, ориентированным на обслуживание 4.0."
                        })}
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">{skillsTitle}</span>
                        {biomedicalSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={t(label)} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faMicrochip} size="3x"/>
                    <h3>{t({ fr: 'Électronique & électrotechnique', en: 'Electronics & electrical engineering', tr: 'Elektronik ve elektroteknik', zh: '电子与电气技术', ru: 'Электроника и электротехника' })}</h3>
                    <p>
                        {t({
                            fr: "Base technique acquise en électrotechnique et en électronique, complétée par la pratique du câblage des moteurs électriques, realisation des schémas électriques pour système industriel et de la conception de systèmes électroniques.",
                            en: "Technical foundation in electrical engineering and electronics, complemented by hands-on motor wiring, drawing electrical schematics for industrial systems, and designing electronic systems.",
                            tr: "Elektroteknik ve elektronik alanında edinilmiş teknik temel; elektrik motorlarının kablolanması, endüstriyel sistemler için elektrik şemalarının çizimi ve elektronik sistem tasarımı uygulamalarıyla tamamlanmıştır.",
                            zh: "具备电气技术与电子技术的专业基础，并在电动机接线、工业系统电气原理图绘制和电子系统设计方面有实践经验。",
                            ru: "Техническая база в области электротехники и электроники, дополненная практикой монтажа электродвигателей, составления электрических схем для промышленных систем и проектирования электронных систем."
                        })}
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">{skillsTitle}</span>
                        {electronicsSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={t(label)} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faRobot} size="3x"/>
                    <h3>{t({ fr: 'Instrumentation biomédicale', en: 'Biomedical instrumentation', tr: 'Biyomedikal enstrümantasyon', zh: '生物医学仪器', ru: 'Биомедицинское приборостроение' })}</h3>
                    <p>
                        {t({
                            fr: "Conception de systèmes de mesure et d'assistance au service du soin, associant capteurs, acquisition et traitement du signal, actionneurs, ROS, vision artificielle et systèmes embarqués (projets MOR-EYES et assistance médicale).",
                            en: "Design of measurement and assistive systems serving patient care, combining sensors, signal acquisition and processing, actuators, ROS, computer vision and embedded systems (MOR-EYES and medical assistance projects).",
                            tr: "Sağlık hizmetine yönelik ölçüm ve yardımcı sistemlerin tasarımı; sensörler, sinyal toplama ve işleme, eyleyiciler, ROS, bilgisayarlı görü ve gömülü sistemleri bir araya getirir (MOR-EYES ve tıbbi yardım projeleri).",
                            zh: "设计服务于医疗护理的测量与辅助系统，融合传感器、信号采集与处理、执行器、ROS、机器视觉和嵌入式系统（MOR-EYES及医疗辅助项目）。",
                            ru: "Проектирование измерительных и вспомогательных систем для медицинской помощи: датчики, сбор и обработка сигналов, исполнительные механизмы, ROS, компьютерное зрение и встраиваемые системы (проекты MOR-EYES и медицинской помощи)."
                        })}
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">{skillsTitle}</span>
                        {roboticsSkills.map((label, index) => (
                            <Chip key={index} className='chip' label={t(label)} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faScrewdriverWrench} size="3x"/>
                    <h3>{t({ fr: 'Conception & prototypage', en: 'Design & prototyping', tr: 'Tasarım ve prototipleme', zh: '设计与原型制作', ru: 'Проектирование и прототипирование' })}</h3>
                    <p>
                        {t({
                            fr: "Réalisation de prototypes dans le cadre de projets académiques et personnels, en combinant électronique, systèmes embarqués et programmation. Niveau orienté apprentissage et développement de prototypes fonctionnels.",
                            en: "Building prototypes for academic and personal projects, combining electronics, embedded systems and programming. Level geared toward learning and developing working prototypes.",
                            tr: "Akademik ve kişisel projeler kapsamında elektronik, gömülü sistemler ve programlamayı birleştiren prototipler geliştiriyorum. Seviye, öğrenmeye ve çalışan prototipler geliştirmeye yöneliktir.",
                            zh: "在学业和个人项目中，结合电子技术、嵌入式系统和编程制作原型。目前的水平以学习和开发可运行原型为主。",
                            ru: "Создание прототипов в рамках учебных и личных проектов с сочетанием электроники, встраиваемых систем и программирования. Уровень ориентирован на обучение и разработку работоспособных прототипов."
                        })}
                    </p>
                    <div className="flex-chips">
                        <span className="chip-title">{toolsTitle}</span>
                        {tools.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;
