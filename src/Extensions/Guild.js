import Discord from 'discord.js'
import Guild from '../Models/Guild'

export default class extends Discord.Guild {
    constructor(client, data) { Logger.debug('extenstion:guild:constructor', { client, data })
        super(client, data)
        
        this.load()
    }

    async load() { Logger.debug('extenstion:guild:load', { })
        const guild = await Guild.findOne({id: this.id})
        if (guild) Object.assign(this.data, guild)
    }

    async save() { Logger.debug('extenstion:guild:save', { })
        let guild = await Guild.findOne({id: this.id})
        if (!guild) guild = new Guild({})
        else Object.assign(guild, this)

        await guild.save()
    }
}