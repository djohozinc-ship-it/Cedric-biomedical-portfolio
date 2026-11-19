import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'
import { useLanguage } from '../i18n/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div>
        <a 
          href="https://github.com/djohozinc-ship-it" 
          target="_blank" 
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>

        <a 
          href="https://www.linkedin.com/in/concepteurdemaintenance" 
          target="_blank" 
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </a>

        <a 
          href="mailto:djohozinc@gmail.com"
          aria-label={t({ fr: 'E-mail', en: 'Email', tr: 'E-posta', zh: '电子邮件', ru: 'Эл. почта' })}
        >
          <EmailIcon />
        </a>

        <p>Cédric DJOHOZIN djohozinc@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer;
