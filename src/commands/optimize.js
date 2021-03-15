import { MessageAttachment } from "discord.js";
import axios from 'axios'
import imageOptimization from '../utilities/imageOptimization'

export async function run(client, message, ...args) {
  try {
    const attachments = message.attachments.array();

    for (let i = 0; i < attachments.length; i++) {
      const { name, url } = attachments[i];
      if (
        !name.endsWith(".jpg") &&
        !name.endsWith(".png") &&
        !name.endsWith(".jpeg")
      ) {
        continue;
      }

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const newBuffer = await imageOptimization(response.data)
      message.inlineReply(new MessageAttachment(newBuffer, name))
    }
  } catch (error) {
    client.logger.error({ error });
  }
}
