import Logger from '../../Libraries/Logger'

export const run = async (client, interaction) => { Logger.debug('command:ping', { pid: process.pid, interaction })
  try {
    interaction.channel.send("Pong!");
  } catch (error) {
    logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
export const description = "Ping => Pong!"
export const options = [];