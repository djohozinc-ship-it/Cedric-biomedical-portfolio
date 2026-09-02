import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';

function Main() {
  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img
            src={`${process.env.PUBLIC_URL}/images/cedric.png`}
            alt="Cédric Djohozin"
          />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/djohozinc-ship-it" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
          <h1>Cédric DJOHOZIN</h1>
          <p>Technicien en Maintenance Biomédicale et Hospitalière • Systèmes biomédicaux intelligents • Technologies embarquées</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/djohozinc-ship-it" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/concepteurdemaintenance" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
