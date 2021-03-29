import { Structures } from 'discord.js'
import TextChannel from '../Models/TextChannel'

import Logger from '../Libraries/Logger'

export class Extension extends Structures.get("TextChannel") {
    constructor(client, data) { Logger.debug('extenstion:textChannel:constructor', { pid: process.pid })
        super(client, data)

        this.load()
    }

    async load() { Logger.debug('extenstion:textChannel:load', { pid: process.pid })
        const textChannel = await TextChannel.findOne({ id: this.id }).exec()
        if (textChannel) Object.assign(this.data, textChannel)
    }

    async save() { Logger.debug('extenstion:textChannel:save', { pid: process.pid })
        let textChannel = await TextChannel.findOne({ id: this.id }).exec()
        if (!textChannel) textChannel = new TextChannel({})
        else Object.assign(textChannel, this)

        await textChannel.save()
    }
}