import Logger from '../Libraries/Logger'

export default async function run(client, reaction, user) { Logger.debug('event:messageReactionAdd', { client, reaction, user })
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.count >= 2) return;

    client.emit(`messageReactionAdd.${reaction.emoji}`, reaction, user);
  } catch (error) {
    Logger.fatal(error);
  }
}
