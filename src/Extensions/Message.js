import { APIMessage, Structures } from "discord.js";

import Logger from '../Libraries/Logger'

export class Extension extends Structures.get("Message") {
  async inlineReply(content, options) { Logger.debug('extenstion:message:inlineReply', { content, options })
    const mentionRepliedUser =
      typeof ((options || content || {}).allowedMentions || {}).repliedUser ===
      "undefined"
        ? true
        : (options || content).allowedMentions.repliedUser;
    delete ((options || content || {}).allowedMentions || {}).repliedUser;

    const apiMessage =
      content instanceof APIMessage
        ? content.resolveData()
        : APIMessage.create(this.channel, content, options).resolveData();
    Object.assign(apiMessage.data, {
      message_reference: { message_id: this.id },
    });

    if (
      !apiMessage.data.allowed_mentions ||
      Object.keys(apiMessage.data.allowed_mentions).length === 0
    )
      apiMessage.data.allowed_mentions = {
        parse: ["users", "roles", "everyone"],
      };

    if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
      Object.assign(apiMessage.data.allowed_mentions, {
        replied_user: mentionRepliedUser,
      });

    if (Array.isArray(apiMessage.data.content)) {
      return Promise.all(
        apiMessage
          .split()
          .map((x) => {
            x.data.allowed_mentions = apiMessage.data.allowed_mentions;
            return x;
          })
          .map(this.inlineReply.bind(this))
      );
    }

    const { data, files } = await apiMessage.resolveFiles();
    return this.client.api.channels[this.channel.id].messages
      .post({ data, files })
      .then((x) => this.client.actions.MessageCreate.handle(x).message);
  }

  async pagedReply(pages, startIndex = 0, options) { Logger.debug('extenstion:message:pagedReply', { pages, startIndex, options })
    let index = startIndex;
    let text = pageToString(pages[index]);

    const filter = (reaction, user) => {
      return (
        ["◀️", "▶️"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    const reply = await message.inlineReply(text, options);
    reply.react("◀️");
    reply.react("▶️");

    const collector = reply.createReactionCollector(filter, { time: 15000 });
    collector.on("collect", (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

      switch (reaction.emoji.name) {
        case "◀️":
          if (index > 0) index--;
          else if (index <= 0) index = pages.length - 1;
          break;

        case "▶️":
          if (index < pages.length - 1) index++;
          else if (index >= pages.length - 1) index = pages.length - 1;
          break;
      }
      collector.resetTimer();
      reaction.remove();
      text = pages[index]
        .map((entry, index) => `${index}. ${entry}`)
        .join("\n");
      reply.edit(text);
    });
    collector.on("end", (collected) => reply.delete());
    message.delete();
  }
}