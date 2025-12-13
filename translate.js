import { translate } from "bing-translate-api";
import fs from "fs-extra";
import { languageList } from "./src/data/languages.js";

const sourceFile = "./public/locales/en/landing.json";

const getBingCode = (code) => {
  const map = {
    zh: "zh-Hans",
    cn: "zh-Hans",
    "zh-cn": "zh-Hans",
    "zh-tw": "zh-Hant",
    tl: "fil",
    iw: "he",
    nb: "no",
    in: "id",
  };
  return map[code.toLowerCase()] || code;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("📂 Reading source English file...");
  const enData = await fs.readJson(sourceFile);

  const translateObject = async (obj, targetLang) => {
    const newObj = {};
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        newObj[key] = await translateObject(obj[key], targetLang);
      } else {
        let retries = 3;
        while (retries > 0) {
          try {
            await sleep(2000);
            const res = await translate(obj[key], null, targetLang);

            if (!res || !res.translation) throw new Error("No translation");

            newObj[key] = res.translation;
            process.stdout.write(".");
            break;
          } catch (e) {
            retries--;
            if (retries === 0) {
              console.log(`\n❌ Failed '${key}'. Keeping English.`);
              newObj[key] = obj[key];
            } else {
              await sleep(3000);
            }
          }
        }
      }
    }
    return newObj;
  };

  for (const lang of languageList) {
    if (lang.code === "en") continue;

    const outputFile = `./public/locales/${lang.code}/landing.json`;

    const bingCode = getBingCode(lang.code);

    console.log(
      `\n\n🌐 Generating ${lang.name} (Using Bing code: ${bingCode})...`
    );

    try {
      const translated = await translateObject(enData, bingCode);
      await fs.outputJson(outputFile, translated, { spaces: 2 });
      console.log(`\n✅ Saved ${lang.name}`);
    } catch (err) {
      console.log(`\n❌ Critical Error on ${lang.name}: ${err.message}`);
    }
  }
  console.log("\n🎉 DONE! All languages generated.");
}

run();
