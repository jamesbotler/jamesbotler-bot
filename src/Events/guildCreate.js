import Logger from '../Libraries/Logger'

export const run = async (client, guild) => { Logger.debug('event:guildCreate', { pid: process.pid, guild: { id } })
  
}
