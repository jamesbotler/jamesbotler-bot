import Logger from '../Libraries/Logger'
import { version } from '../../package.json'

export const run = async (client) => { Logger.debug('event:ready', { pid: process.pid })
  
  Logger.info('event:ready', { version })
}
