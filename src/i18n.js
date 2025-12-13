import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { languageList } from "./data/languages.js";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: languageList.map((lang) => lang.code),
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,

    ns: ["common", "landing", "auth", "dashboard"],
    defaultNS: "common",

    debug: true,

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
