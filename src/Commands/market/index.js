import axios from 'axios'
import config from '../../config'
import fs from 'fs'
import csv from 'csvtojson'

import Logger from '../../Libraries/Logger'

export const run = async (client, message) => { Logger.debug('command:market', { pid: process.pid, message })
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
    Logger.fatal(Object.assign(error, { pid: process.pid }));
  }
}
export const description = "Send a random adorable animal photo"
export const options = [
  {
    name: "animal",
    description: "The type of animal",
    type: 3,
    required: true,
    choices: [
      {
        name: "Dog",
        value: "animal_dog",
      },
      {
        name: "Cat",
        value: "animal_cat",
      },
      {
        name: "Penguin",
        value: "animal_penguin",
      },
    ],
  },
  {
    name: "only_smol",
    description: "Whether to show only baby animals",
    type: 5,
    required: false,
  },
];