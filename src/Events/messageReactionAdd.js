import Logger from '../Libraries/Logger'

export const run = async (client, reaction, user) => { Logger.debug('event:messageReactionAdd', { pid: process.pid, reaction, user })
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.count >= 2) return;
    
    Logger.info('event:messageReactionAdd:run', { reaction: reaction.emoji, user: user.id })
    client.emit(`messageReactionAdd.${reaction.emoji}`, reaction, user);
  } catch (error) {
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
