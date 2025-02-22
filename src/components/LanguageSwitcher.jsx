import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="btn-group me-3">
      <button className="btn btn-outline-light" onClick={() => changeLanguage('en')}>English</button>
      <button className="btn btn-outline-light" onClick={() => changeLanguage('ru')}>Русский</button>
    </div>
  );
};

export default LanguageSwitcher;
