import config from "../config";
import commandParser from "../Utilities/commandParser";

import Logger from '../Libraries/Logger'

export const run = async (client, message) => { Logger.debug('event:message', { pid: process.pid, message })
  try {
    if (message.author.bot || message.author === client.user) return;
    
    if (message.cleanContent.startsWith(config.command_prefix)) {
      const args = commandParser(message.cleanContent);
      const command = args.shift().slice(config.command_prefix.length);
      client.emit(`command.${command}`, message, args);
    }

    Logger.info('event:message:run', { message: message.content })
  } catch (error) {
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
