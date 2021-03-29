import Logger from '../../Libraries/Logger'

export const run = async (client, message) => { Logger.info('command:ping', { pid: process.pid, message: { id } })
  try {
    message.inlineReply("Pong!");
  } catch (error) {
    logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
export const description = "Ping => Pong!"
export const options = [];