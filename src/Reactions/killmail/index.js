import Tesseract from "tesseract.js";
import imageOptimization from "../../Utilities/imageOptimization";
import axios from "axios";
import gm from "gm";
import escapeText from "../../Utilities/escapeText";
import { MessageAttachment } from "discord.js";

import Logger from '../../Libraries/Logger'

export const emojis = ["🔫"];
export const run = async (client, reaction, user) => {
  try {
    if (!reaction.message.attachments.array().length) return;

    const attachments = reaction.message.attachments.array();

    for (let i = 0; i < attachments.length; i++) {
      const { name, url, width, height } = attachments[i];
      if (
        name.endsWith(".jpg") ||
        name.endsWith(".png") ||
        name.endsWith(".jpeg")
      ) {
        let textFactory = { head: "Please Wait..." };
        const message = await reaction.message.inlineReply(
          Object.values(textFactory).join("\n")
        );
        const img = await axios.get(url, { responseType: "arraybuffer" });
        const optimizedImage = await imageOptimization(img.data);
        Tesseract.recognize(optimizedImage, "eng", {
          cachePath: "./data/tesseract",
          logger: async function (m) {
            if (Math.floor(m.progress * 10) % 10 != 0) return;
            Logger.info("Tesseract", m);
            const key = m.status.replace(/\(.*\)/, "").split(" ");
            key.shift();
            textFactory[key.join()] = `[${
              m.progress == 1 ? "DONE" : Math.floor(m.progress * 100) + "%"
            }] ${m.status}`;
            await message.edit(Object.values(textFactory).join("\n"));
          },
        })
          .then(async function ({ data }) {
            textFactory = {};
            let img = gm(optimizedImage);
            for (const line of data.lines) {
              let { words } = line;
              words = words.filter(word => word.text.length >= 3)

              if (words.length < 1) continue
              img = img.stroke("#ff00ff", 1);
              img = img.fill("transparent");
              img = img.drawRectangle(
                words[0].bbox.x0 - 5,
                words[0].bbox.y0 - 5,
                words[words.length-1].bbox.x1 + 5,
                words[words.length-1].bbox.y1 + 5
              );
              textFactory[Object.keys(textFactory).length] = words.map(word => word.text).join(' ');
            }
            img.toBuffer("JPG", (error, buf) => {
              if (error) Logger.error("GM", error);
              message.inlineReply(new MessageAttachment(buf, name));
            });

            await message.edit(
              escapeText(Object.values(textFactory).join("\n"))
            );
          })
          .catch((error) => {
            Logger.fatal(Object.assign(error, { pid: process.pid }));
          });
      }
    }
  } catch (error) {
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
