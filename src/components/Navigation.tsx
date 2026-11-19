import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import List from '@mui/material/List';
import ListIcon from '@mui/icons-material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { Tr, useLanguage } from '../i18n/LanguageContext';

const drawerWidth = 240;
const navItems: [Tr, string][] = [
  [{ fr: 'Expertise', en: 'Expertise', tr: 'Uzmanlık', zh: '专业能力', ru: 'Экспертиза' }, 'expertise'],
  [{ fr: 'Parcours', en: 'Background', tr: 'Özgeçmiş', zh: '履历', ru: 'Путь' }, 'history'],
  [{ fr: 'Projets', en: 'Projects', tr: 'Projeler', zh: '项目', ru: 'Проекты' }, 'projects'],
  [{ fr: 'Galerie', en: 'Gallery', tr: 'Galeri', zh: '图库', ru: 'Галерея' }, 'gallery'],
  [{ fr: 'Contact', en: 'Contact', tr: 'İletişim', zh: '联系', ru: 'Контакты' }, 'contact'],
];

function Navigation({parentToChild, modeChange}: any) {
  const {mode} = parentToChild;
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navigation");
      if (navbar) {
        const isScrolled = window.scrollY > navbar.clientHeight;
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: string) => {
    // Les sections lourdes sont chargées à la demande : on les force à se monter,
    // puis on attend que l’élément existe avant de défiler.
    const goToSection = () => {
      // Les sections au-dessus de la cible finissent de se charger pendant le défilement et
      // décalent la page : on recale donc la position jusqu’à ce qu’elle soit stable.
      const wanted = 72; // doit correspondre à scroll-margin-top dans index.scss
      let attempts = 0;
      let stableChecks = 0;
      let started = false;
      let lastY = window.scrollY;
      const tick = () => {
        const element = document.getElementById(section);
        if (!element) {
          if (attempts++ < 60) window.setTimeout(tick, 75);
          return;
        }
        // Tant que la page défile encore, on ne touche à rien : on attend qu’elle se pose.
        const moving = started && Math.abs(window.scrollY - lastY) > 1;
        lastY = window.scrollY;
        const offset = element.getBoundingClientRect().top - wanted;
        if (moving) {
          stableChecks = 0;
        } else if (Math.abs(offset) <= 24) {
          stableChecks += 1;
        } else {
          stableChecks = 0;
          started = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (stableChecks < 3 && attempts++ < 40) window.setTimeout(tick, 250);
      };
      tick();
    };

    window.dispatchEvent(new Event('portfolio:preload'));

    if (window.location.hash.startsWith('#/project/')) {
      // Depuis une fiche projet, on revient d’abord à l’accueil.
      try { sessionStorage.removeItem('projects-scroll-position'); } catch { /* ignore */ }
      window.location.hash = '';
      window.setTimeout(goToSection, 200);
    } else {
      goToSection();
    }
  };

  const drawer = (
    <Box className="navigation-bar-responsive" onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <p className="mobile-menu-top"><ListIcon/>Menu</p>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item[1]} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => scrollToSection(item[1])}>
              <ListItemText primary={t(item[0])} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" id="navigation" className={`navbar-fixed-top${scrolled ? ' scrolled' : ''}`}>
        <Toolbar className='navigation-bar'>
          <IconButton
            color="inherit"
            aria-label={t({ fr: 'Ouvrir le menu', en: 'Open the menu', tr: 'Menüyü aç', zh: '打开菜单', ru: 'Открыть меню' })}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            color="inherit"
            onClick={() => modeChange()}
            aria-label={mode === 'dark'
              ? t({ fr: 'Activer le mode clair', en: 'Switch to light mode', tr: 'Açık moda geç', zh: '切换到浅色模式', ru: 'Включить светлую тему' })
              : t({ fr: 'Activer le mode sombre', en: 'Switch to dark mode', tr: 'Koyu moda geç', zh: '切换到深色模式', ru: 'Включить тёмную тему' })}
            title={mode === 'dark'
              ? t({ fr: 'Mode clair', en: 'Light mode', tr: 'Açık mod', zh: '浅色模式', ru: 'Светлая тема' })
              : t({ fr: 'Mode sombre', en: 'Dark mode', tr: 'Koyu mod', zh: '深色模式', ru: 'Тёмная тема' })}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <LanguageSwitcher />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item[1]} onClick={() => scrollToSection(item[1])} sx={{ color: '#fff' }}>
                {t(item[0])}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Navigation;
