import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'

function Footer() {
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
          aria-label="Email"
        >
          <EmailIcon />
        </a>

        <p>Cédric DJOHOZIN djohozinc@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer;
