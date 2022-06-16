import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from 'shared/internationalization/locales/en/translation.json';
import translationES from 'shared/internationalization/locales/es/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
};

i18next.use(LanguageDetector).init({
  detection: {
    order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
  },
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false
  },
  keySeparator: false,
  resources
});

export const translate = i18next.t;

