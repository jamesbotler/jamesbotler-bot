import tunnelFetch from "../Utilities/tunnelFetch";
import sha256 from "../Utilities/sha256";
import config from "../config";
import fs from "fs";
import path from "path";

import Translation from "../Models/Translation";

export default async function run(str, lang) {
  const lines = str.split(".\n");
  let response = [];

  for (const line of lines) {
    const hash = sha256(line);
    let translation = await Translation.findOne({ hash }).exec();
    if (!translation) {
      translation = new Translation({
        hash,
        text: line,
        target: [
          {
            lang,
            text: await translate(line, lang),
          },
        ],
      });
    } else {
      if (!translation.target.find((target) => target.lang === lang)) {
        translation.target.push({
          lang,
          text: await translate(line, lang),
        });
        translation.edit({
          target: [
            {
              lang,
              text: await translate(line, lang),
            },
          ],
        });
      }
    }
    response.push(
      translation.target.find((target) => target.lang === lang).text
    );
  }

  return response.join(".\n");
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

  if (
    !response ||
    !response.status === 200 ||
    !response.data ||
    !response.data.translation
  ) {
    console.log(response.data, response.statusText);
  }

  return response.data.translation;
}
