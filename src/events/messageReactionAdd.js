export async function run(client, reaction, user) {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.count >= 2) return;

    client.emit(`messageReactionAdd.${reaction.emoji}`, reaction, user);
  } catch (error) {
    client.logger.error({error});
  }
}
