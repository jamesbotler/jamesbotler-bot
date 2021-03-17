import Logger from '../Libraries/Logger'

export const run = async (client, reaction, user) => { Logger.debug('event:messageReactionAdd', { reaction, user })
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.count >= 2) return;

    client.emit(`messageReactionAdd.${reaction.emoji}`, reaction, user);
  } catch (error) {
    Logger.fatal(error);
  }
}
