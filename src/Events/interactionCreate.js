import config from "../config";
import commandParser from "../Utilities/commandParser";

import Logger from '../Libraries/Logger'

export const run = async (client, interaction) => { Logger.debug('event:interactionCreate', { pid: process.pid, interaction: { id } })
  try {
    const { commandName } = interaction
    Logger.info('event:interactionCreate:run', { commandName })
    client.emit(`command.${commandName}`, interaction);
  } catch (error) {
    Logger.fatal(error);
  }
}
