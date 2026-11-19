import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { LANGUAGES, useLanguage } from './LanguageContext';

function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const label = t({
    fr: 'Changer de langue',
    en: 'Change language',
    tr: 'Dili değiştir',
    zh: '切换语言',
    ru: 'Сменить язык',
  });

  return (
    <>
      <Button
        color="inherit"
        onClick={(event) => setAnchor(event.currentTarget)}
        startIcon={<LanguageIcon />}
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={Boolean(anchor)}
        title={label}
        className="language-switcher-button"
        sx={{ minWidth: 0, textTransform: 'none', fontWeight: 600 }}
      >
        {current.label}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {LANGUAGES.map((item) => (
          <MenuItem
            key={item.code}
            selected={item.code === lang}
            lang={item.code}
            onClick={() => {
              setLang(item.code);
              setAnchor(null);
            }}
          >
            {item.name}
            {item.code === lang && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LanguageSwitcher;
