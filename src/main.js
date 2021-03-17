import { BaseCluster } from 'kurasuta'
import Logger from './Libraries/Logger'

export default class extends BaseCluster {
  launch() {
    try {
      this.client.login(process.env.DISCORD_TOKEN)
    } catch (error) { Logger.fatal(error) }
  }
}