import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import { useLanguage } from '../i18n/LanguageContext';

function Main() {
  const { t } = useLanguage();
  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img
            src={`${process.env.PUBLIC_URL}/images/cedric.jpg`}
            alt="Cédric Djohozin"
            width="150"
            height="150"
            decoding="async"
          />
        </div>

        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/djohozinc-ship-it" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/concepteurdemaintenance" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>

          <h1>Cédric DJOHOZIN</h1>

          <p>
            {t({
              fr: 'Technicien en Maintenance Biomédicale et Hospitalière • Systèmes biomédicaux intelligents • Instrumentation Biomédicale • Technologies embarquées',
              en: 'Biomedical and Hospital Maintenance Technician • Intelligent Biomedical Systems • Biomedical Instrumentation • Embedded Technologies',
              tr: 'Biyomedikal ve Hastane Bakım Teknisyeni • Akıllı Biyomedikal Sistemler • Biyomedikal Enstrümantasyon • Gömülü Teknolojiler',
              zh: '生物医学与医院设备维护技术员 • 智能生物医学系统 • 生物医学仪器 • 嵌入式技术',
              ru: 'Техник по биомедицинскому и больничному обслуживанию • Интеллектуальные биомедицинские системы • Биомедицинское приборостроение • Встраиваемые технологии'
            })}
          </p>

          <div className="mobile_social_icons">
            <a href="https://github.com/djohozinc-ship-it" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/concepteurdemaintenance" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
