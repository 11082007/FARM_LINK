// translate.js
import translate from "@vitalets/google-translate-api";
import fs from "fs-extra";
import { languageList } from "./src/data/languages.js"; // Import your huge list

const sourceFile = "./public/locales/en/landing.json"; // Ensure this path is correct

async function run() {
  const enData = await fs.readJson(sourceFile);

  // Helper to translate nested objects
  const translateObject = async (obj, targetLang) => {
    const newObj = {};
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        newObj[key] = await translateObject(obj[key], targetLang);
      } else {
        try {
          const res = await translate(obj[key], { to: targetLang });
          newObj[key] = res.text;
        } catch (e) {
          console.error(`Error translating ${key} to ${targetLang}`);
          newObj[key] = obj[key]; // Fallback to English on error
        }
      }
    }
    return newObj;
  };

  // Loop through YOUR language list
  for (const lang of languageList) {
    if (lang.code === "en") continue; // Skip English

    console.log(`Generating ${lang.name} (${lang.code})...`);
    const translated = await translateObject(enData, lang.code);

    // Auto-create the file i18next needs
    await fs.outputJson(
      `./public/locales/${lang.code}/landing.json`,
      translated,
      { spaces: 2 }
    );
  }
  console.log("✅ All languages generated!");
}

run();
