import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss';
import { useLanguage } from '../i18n/LanguageContext';

function Timeline() {
  const { t } = useLanguage();
  const ongoing = t({ fr: 'En cours', en: 'Present', tr: 'Devam ediyor', zh: '至今', ru: 'по настоящее время' });
  const veryGood = t({ fr: 'Mention Très Bien', en: 'Graduated with high distinction', tr: 'Pekiyi derece', zh: '成绩优异（Très Bien）', ru: 'С отличием (Très Bien)' });
  const good = t({ fr: 'Mention Bien', en: 'Graduated with distinction', tr: 'İyi derece', zh: '成绩良好（Bien）', ru: 'С хорошей оценкой (Bien)' });
  const intern = t({ fr: 'Stagiaire', en: 'Intern', tr: 'Stajyer', zh: '实习生', ru: 'Стажёр' });
  return (
    <div id="history">
      <div className="items-container">
        <h1 aria-level={2}>{t({ fr: 'Parcours', en: 'Background', tr: 'Özgeçmiş', zh: '履历', ru: 'Путь' })}</h1>
        <VerticalTimeline>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid white' }}
            date={`28/09/2026 - ${ongoing}`}
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Bénévolat — Centre Hospitalier Départemental du Zou`, en: `Volunteer — Zou Departmental Hospital Centre (CHD-Zou)`, tr: `Gönüllü — Zou Bölge Hastane Merkezi (CHD-Zou)`, zh: `志愿者 — 祖省省级医院中心（CHD-Zou）`, ru: `Волонтёр — Департаментский больничный центр Зу (CHD-Zou)` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Direction des Équipements et de la Maintenance`, en: `Directorate of Equipment and Maintenance`, tr: `Ekipman ve Bakım Müdürlüğü`, zh: `设备与维护管理处`, ru: `Дирекция оборудования и технического обслуживания` })}</h4>
            <p>
              {t({
                fr: `Réalisation d’activités de maintenance préventive et corrective des dispositifs médicaux, Installation et mise en service de dispositifs médicaux, Mise en place de dispositif complet de sécurité patient au CHD-Zou`,
                en: `Carrying out preventive and corrective maintenance of medical devices, installing and commissioning medical devices, and setting up a complete patient-safety system at CHD-Zou`,
                tr: `Tıbbi cihazların önleyici ve düzeltici bakım faaliyetlerinin yürütülmesi, tıbbi cihazların kurulumu ve devreye alınması, CHD-Zou'da eksiksiz bir hasta güvenliği sisteminin kurulması`,
                zh: `开展医疗设备的预防性与纠正性维护，安装并调试医疗设备，并在CHD-Zou建立完整的患者安全系统`,
                ru: `Профилактическое и корректирующее обслуживание медицинских изделий, монтаж и ввод в эксплуатацию медицинских изделий, создание комплексной системы безопасности пациентов в CHD-Zou`
              })}
            </p>
          </VerticalTimelineElement>

          
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid white' }}
            date="23/03/2026 - 12/06/2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Stagiaire — Centre Hospitalier Départemental du Zou`, en: `Intern — Zou Departmental Hospital Centre (CHD-Zou)`, tr: `Stajyer — Zou Bölge Hastane Merkezi (CHD-Zou)`, zh: `实习生 — 祖省省级医院中心（CHD-Zou）`, ru: `Стажёр — Департаментский больничный центр Зу (CHD-Zou)` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Direction des Équipements et de la Maintenance`, en: `Directorate of Equipment and Maintenance`, tr: `Ekipman ve Bakım Müdürlüğü`, zh: `设备与维护管理处`, ru: `Дирекция оборудования и технического обслуживания` })}</h4>
            <p>
              {t({
                fr: `Participation aux activités de maintenance préventive et corrective, au diagnostic et à la recherche de pannes, à l’installation de dispositifs médicaux, à l’inventaire et aux tests de fonctionnement des équipements et au suivi des activités de maintenance.`,
                en: `Taking part in preventive and corrective maintenance, diagnostics and troubleshooting, installation of medical devices, equipment inventory and functional testing, and follow-up of maintenance activities.`,
                tr: `Önleyici ve düzeltici bakım faaliyetlerine, arıza teşhisi ve arıza aramaya, tıbbi cihaz kurulumuna, ekipman envanterine ve işlevsel testlere ile bakım faaliyetlerinin takibine katılım.`,
                zh: `参与预防性与纠正性维护、故障诊断与排查、医疗设备安装、设备盘点与功能测试，以及维护工作的跟踪。`,
                ru: `Участие в профилактическом и корректирующем обслуживании, диагностике и поиске неисправностей, монтаже медицинских изделий, инвентаризации и функциональных испытаниях оборудования, а также в контроле работ по обслуживанию.`
              })}
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="11/08/2025 - 05/09/2025"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Stagiaire — Centre Hospitalier Départemental du Zou`, en: `Intern — Zou Departmental Hospital Centre (CHD-Zou)`, tr: `Stajyer — Zou Bölge Hastane Merkezi (CHD-Zou)`, zh: `实习生 — 祖省省级医院中心（CHD-Zou）`, ru: `Стажёр — Департаментский больничный центр Зу (CHD-Zou)` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Direction des Équipements et de la Maintenance`, en: `Directorate of Equipment and Maintenance`, tr: `Ekipman ve Bakım Müdürlüğü`, zh: `设备与维护管理处`, ru: `Дирекция оборудования и технического обслуживания` })}</h4>
            <p>
              {t({
                fr: `Participation aux interventions de maintenance et à l’installation de dispositifs médicaux, découverte de l’environnement hospitalier et participation aux activités administratives liées à la maintenance.`,
                en: `Taking part in maintenance interventions and installation of medical devices, discovering the hospital environment, and helping with the administrative tasks related to maintenance.`,
                tr: `Bakım müdahalelerine ve tıbbi cihaz kurulumuna katılım, hastane ortamını tanıma ve bakımla ilgili idari işlere katkı.`,
                zh: `参与维护作业和医疗设备安装，了解医院环境，并协助处理与维护相关的行政事务。`,
                ru: `Участие в работах по обслуживанию и монтажу медицинских изделий, знакомство с больничной средой и участие в административных задачах, связанных с обслуживанием.`
              })}
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="12/08/2024 - 06/09/2024"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Stagiaire — Hôpital de Zone de Covè`, en: `Intern — Covè Zone Hospital`, tr: `Stajyer — Covè Bölge Hastanesi`, zh: `实习生 — 科韦区域医院（Covè）`, ru: `Стажёр — Зональная больница Ковэ` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Service Biomédical`, en: `Biomedical Department`, tr: `Biyomedikal Birimi`, zh: `生物医学部门`, ru: `Биомедицинская служба` })}</h4>
            <p>
              {t({
                fr: `Participation aux activités de maintenance préventive et corrective et à l’installation de dispositifs médicaux.`,
                en: `Taking part in preventive and corrective maintenance and in the installation of medical devices.`,
                tr: `Önleyici ve düzeltici bakım faaliyetlerine ve tıbbi cihaz kurulumuna katılım.`,
                zh: `参与预防性与纠正性维护以及医疗设备安装。`,
                ru: `Участие в профилактическом и корректирующем обслуживании и монтаже медицинских изделий.`
              })}
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="25/07/2022 - 01/09/2022"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">{intern} — SERIB</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Service de Rembobinage Industriel et de Bâtiment`, en: `Industrial and Building Rewinding Service`, tr: `Endüstriyel ve Yapı Sarım Hizmeti`, zh: `工业与建筑电机重绕服务部`, ru: `Служба промышленной и строительной перемотки электродвигателей` })}</h4>
            <p>
              {t({
                fr: `Montage et démontage de moteurs électriques, entretien des moteurs et initiation aux opérations de rembobinage.`,
                en: `Assembly and disassembly of electric motors, motor maintenance, and introduction to rewinding operations.`,
                tr: `Elektrik motorlarının montajı ve demontajı, motor bakımı ve sarım işlemlerine giriş.`,
                zh: `电动机的装配与拆卸、电机保养，以及重绕作业入门。`,
                ru: `Сборка и разборка электродвигателей, техническое обслуживание двигателей и знакомство с операциями перемотки.`
              })}
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Licence professionnelle en Maintenance Biomédicale et Hospitalière`, en: `Professional Bachelor’s Degree in Biomedical and Hospital Maintenance`, tr: `Biyomedikal ve Hastane Bakımı Mesleki Lisans Derecesi`, zh: `生物医学与医院设备维护专业学士学位`, ru: `Профессиональный бакалавриат по биомедицинскому и больничному обслуживанию` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `École Polytechnique d’Abomey-Calavi (EPAC)`, en: `Polytechnic School of Abomey-Calavi (EPAC)`, tr: `Abomey-Calavi Politeknik Okulu (EPAC)`, zh: `阿波美卡拉维理工学院（EPAC）`, ru: `Политехническая школа Абомей-Калави (EPAC)` })}</h4>
            <h5 className="vertical-timeline-element-subtitle">{veryGood}</h5>
            <p>
              {t({
                fr: `Formation en maintenance biomédicale et hospitalière, dispositifs médicaux, diagnostic, installation et suivi des équipements de santé.`,
                en: `Training in biomedical and hospital maintenance, medical devices, diagnostics, and the installation and follow-up of healthcare equipment.`,
                tr: `Biyomedikal ve hastane bakımı, tıbbi cihazlar, arıza teşhisi, sağlık ekipmanlarının kurulumu ve takibi eğitimi.`,
                zh: `涵盖生物医学与医院设备维护、医疗器械、故障诊断、医疗设备安装与跟踪的专业培训。`,
                ru: `Обучение биомедицинскому и больничному обслуживанию, медицинским изделиям, диагностике, монтажу и сопровождению медицинского оборудования.`
              })}
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Baccalauréat Technique — Électrotechnique`, en: `Technical Baccalaureate — Electrical Engineering`, tr: `Teknik Bakalorya — Elektroteknik`, zh: `技术类业士学位 — 电气技术`, ru: `Технический бакалавриат — Электротехника` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Lycée Technique et Professionnel de Porto-Novo`, en: `Technical and Vocational High School of Porto-Novo`, tr: `Porto-Novo Teknik ve Meslek Lisesi`, zh: `波多诺伏技术与职业高中`, ru: `Технический и профессиональный лицей Порто-Ново` })}</h4>
            <h5 className="vertical-timeline-element-subtitle">{good}</h5>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Diplôme du Technicien Industriel (DTI) — Électrotechnique`, en: `Industrial Technician Diploma (DTI) — Electrical Engineering`, tr: `Endüstriyel Teknisyen Diploması (DTI) — Elektroteknik`, zh: `工业技术员文凭（DTI）— 电气技术`, ru: `Диплом промышленного техника (DTI) — Электротехника` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Lycée Technique et Professionnel de Porto-Novo`, en: `Technical and Vocational High School of Porto-Novo`, tr: `Porto-Novo Teknik ve Meslek Lisesi`, zh: `波多诺伏技术与职业高中`, ru: `Технический и профессиональный лицей Порто-Ново` })}</h4>
            <h5 className="vertical-timeline-element-subtitle">{veryGood}</h5>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2022"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Certificat d’Aptitude Professionnelle (CAP) — Électricité`, en: `Vocational Aptitude Certificate (CAP) — Electricity`, tr: `Mesleki Yeterlilik Belgesi (CAP) — Elektrik`, zh: `职业能力证书（CAP）— 电工`, ru: `Свидетельство о профессиональной пригодности (CAP) — Электрика` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">{t({ fr: `Lycée Technique et Professionnel de Porto-Novo`, en: `Technical and Vocational High School of Porto-Novo`, tr: `Porto-Novo Teknik ve Meslek Lisesi`, zh: `波多诺伏技术与职业高中`, ru: `Технический и профессиональный лицей Порто-Ново` })}</h4>
            <h5 className="vertical-timeline-element-subtitle">{good}</h5>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2021"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">{t({ fr: `Formation en Électronique et Électrotechnique`, en: `Training in Electronics and Electrical Engineering`, tr: `Elektronik ve Elektroteknik Eğitimi`, zh: `电子与电气技术培训`, ru: `Обучение электронике и электротехнике` })}</h3>
            <h4 className="vertical-timeline-element-subtitle">CFREE — Bohicon</h4>
            <p>
              {t({
                fr: `Câblage et maintenance électriques, moteurs triphasés, systèmes photovoltaïques et antennes paraboliques.`,
                en: `Electrical wiring and maintenance, three-phase motors, photovoltaic systems and satellite dishes.`,
                tr: `Elektrik kablolama ve bakımı, üç fazlı motorlar, fotovoltaik sistemler ve çanak antenler.`,
                zh: `电气布线与维护、三相电动机、光伏系统和抛物面卫星天线。`,
                ru: `Электромонтаж и обслуживание, трёхфазные двигатели, фотоэлектрические системы и параболические антенны.`
              })}
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;
