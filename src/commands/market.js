import axios from 'axios'
import config from '../config'
import fs from 'fs'
import csv from 'csvtojson'

export async function run(client, message, ...args) {
  try {
    const response = await axios.get(`${config.eve_market_api}/market-stats/stats.csv`, { responseType: 'stream' })
    if (fs.existsSync('./cache/eve_echoes_market_data.json')) {
      const endTime = new Date(fs.statSync('./cache/eve_echoes_market_data.json').mtime).getTime() + 86400000
      if (endTime < new Date().getTime()) {
        fs.unlinkSync('./cache/eve_echoes_market_data.json')
      }
    }

    fs.writeFileSync('./cache/eve_echoes_market_data.json', await csv().fromStream(response.data))

    const marketData = JSON.parse(fs.readFileSync('./cache/eve_echoes_market_data.json'))
   
    const reply = await message.inlineReply("dasd");
  } catch (error) {
    client.logger.error({error});
  }
}
