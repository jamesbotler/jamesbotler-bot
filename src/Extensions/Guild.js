import { Structures } from 'discord.js'
import Guild from '../Models/Guild'

import Logger from '../Libraries/Logger'

export class Extension extends Structures.get("Guild") {
    constructor(client, data) { Logger.debug('extenstion:guild:constructor', { data })
        super(client, data)
        
        this.load()
    }

    async load() { Logger.debug('extenstion:guild:load', { })
        const guild = await Guild.findOne({id: this.id}).exec()
        if (guild) Object.assign(this.data, guild)
    }

    async save() { Logger.debug('extenstion:guild:save', { })
        let guild = await Guild.findOne({id: this.id}).exec()
        if (!guild) guild = new Guild({})
        else Object.assign(guild, this)

        await guild.save()
    }
}