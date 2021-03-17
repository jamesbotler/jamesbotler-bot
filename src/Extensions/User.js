import Discord from 'discord.js'
import User from '../Models/User'

export default class extends Discord.User {
    constructor(client, data) {
        super(client, data)

        this.load()
    }

    async load() { Logger.debug('extenstion:user:load', { })
        const user = await User.findOne({id: this.id})
        if (user) Object.assign(this.data, user)
    }

    async save() { Logger.debug('extenstion:user:save', { })
        let user = await User.findOne({id: this.id})
        if (!user) user = new User({})
        else Object.assign(user, this)

        await user.save()
    }
}