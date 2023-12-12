import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEn from '../locales/en.json';
import translationVi from '../locales/vi.json';

const localeStorage = localStorage.getItem("lang");

const resources = {
  en: { translation: translationEn },
  vi: { translation: translationVi },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: localeStorage ? localeStorage : "vi",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
