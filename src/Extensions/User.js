import { Structures } from 'discord.js'
import User from '../Models/User'

import Logger from '../Libraries/Logger'

export class Extension extends Structures.get("User") {
    constructor(client, data) { Logger.debug('extenstion:user:constructor', { pid: process.pid, data })
        super(client, data)

        this.load()
    }

    async load() { Logger.debug('extenstion:user:load', { pid: process.pid })
        const user = await User.findOne({ id: this.id }).exec()
        if (user) Object.assign(this.data, user)
    }

    async save() { Logger.debug('extenstion:user:save', { pid: process.pid })
        let user = await User.findOne({ id: this.id }).exec()
        if (!user) user = new User({})
        else Object.assign(user, this)

        await user.save()
    }
}