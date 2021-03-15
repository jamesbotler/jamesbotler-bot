import tunnelFetch from "../utilities/tunnelFetch";
import sha256 from "../utilities/sha256";
import config from "../config";
import fs from "fs";
import path from "path";

export default async function run(str, lang) {
  const lines = str.split('.\n')
  let translation = ''

  for (const line of lines) {
    const hash = sha256(line);
    const dbPath = path.join("./", "data", 'translations', `${hash}.db`);
    const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};
    if (!db.source) db.source = line;

    if (!db || !db[lang]) {
      db[lang] = await translate(line, lang);
      fs.writeFileSync(dbPath, JSON.stringify(db));
    }

    if (db[lang].endWith('.')) {
      translation += `${db[lang]}\n`
    } else {
      translation += `${db[lang]}.\n`
    }
  }

  return translation;
}

async function translate(str, lang) {
  const response = await tunnelFetch({
    method: "POST",
    url: config.translation_api,
    data: { q: str },
    params: {
      source: "auto",
      target: lang,
    },
  });

  if (!response || !response.status === 200 || !response.data || !response.data.translation) {
    console.log(response)
  }

  return response.data.translation;
}
