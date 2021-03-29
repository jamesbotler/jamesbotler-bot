import { MessageAttachment } from "discord.js";
import axios from 'axios'
import imageOptimization from '../../Utilities/imageOptimization'

import Logger from '../../Libraries/Logger'

export const run = async (client, message) => { Logger.debug('command:optimize', { pid: process.pid, message: { id } })
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
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
export const description = "Send a random adorable animal photo"
export const options = [
  {
    name: "animal",
    description: "The type of animal",
    type: 3,
    required: true,
    choices: [
      {
        name: "Dog",
        value: "animal_dog",
      },
      {
        name: "Cat",
        value: "animal_cat",
      },
      {
        name: "Penguin",
        value: "animal_penguin",
      },
    ],
  },
  {
    name: "only_smol",
    description: "Whether to show only baby animals",
    type: 5,
    required: false,
  },
];