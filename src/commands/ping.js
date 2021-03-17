import Logger from '../Libraries/Logger'

export default async function run(client, interaction) { Logger.debug('command:ping', { client, interaction })
  try {
    message.inlineReply("Pong!");
  } catch (error) {
    logger.fatal(error);
  }
}
export const description = "Send a random adorable animal photo"
export const options = [
  {
    name: "animal",
    description: "The type of animal",
    type: 3,
    required: True,
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
    required: False,
  },
];