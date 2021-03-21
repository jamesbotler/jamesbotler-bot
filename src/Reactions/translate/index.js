import flagMap from "../../data/flagMap";
import translate from "../../Modules/translate";
import escapeText from "../../Utilities/escapeText";

import Logger from '../../Libraries/Logger'

export const emojis = flagMap.map((flag) => flag.flag_emoji);
export const run = async (client, reaction, user) => { Logger.debug('reaction:translate', { pid: process.pid, reaction, user })
  try {
    if (reaction.message.cleanContent === "") return;
    const flag = flagMap.find(
      (flag) => flag.flag_emoji === reaction.emoji.name
    );
    const reply = await reaction.message.inlineReply("Please wait ...");
    await reply.edit(await translate("Please wait ...", flag.lang_code));
    translate(escapeText(reaction.message.cleanContent), flag.lang_code).then(
      (translation) => {
        reply.edit(`**${escapeText(translation)}**`);
      }
    );
  } catch (error) {
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
