import Tesseract from "tesseract.js";
import imageOptimization from "../utilities/imageOptimization";
import axios from "axios";
import gm from "gm";
import escapeText from "../utilities/escapeText";
import { MessageAttachment } from "discord.js";

export const emojis = ["🔫"];
export async function run(client, reaction, user) {
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
            client.logger.info(m);
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
              words.filter(word => word.confidence >= 50)
              img = img.stroke("#ff00ff", 5);
              img = img.fill("transparent");
              img = img.drawRectangle(
                words[0].bbox.x0 - 5,
                words[0].bbox.y0 - 5,
                words[words.length].bbox.x1 + 5,
                words[words.length].bbox.y1 + 5
              );
              textFactory[Object.keys(textFactory).length] = words.map(word => word.text).join(' ');
            }
            img.toBuffer("JPG", (error, buf) => {
              if (error) client.log.error({ error });
              message.inlineReply(new MessageAttachment(buf, name));
            });

            await message.edit(
              escapeText(Object.values(textFactory).join("\n"))
            );
          })
          .catch((error) => {
            client.logger.error({ error });
          });
      }
    }
  } catch (error) {
    client.logger.error({ error });
  }
}
