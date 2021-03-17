import Logger from '../Libraries/Logger'
import { version } from '../../package.json'

export default async function run(client) { Logger.debug('event:ready', { client })
  
  Logger.info('event:ready', { version })
}
