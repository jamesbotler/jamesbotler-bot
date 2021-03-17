import { ShardingManager } from 'kurasuta'
import Path from 'path'

import Client from './Client'

const isProduction = process.env.NODE_ENV === 'production'
const shardingManager = new ShardingManager(Path.join(__dirname, 'Main'), {
    client: Client,
    clientOptions: {
        partials: ["USER", "GUILD_MEMBER", "MESSAGE", "CHANNEL", "REACTION"]
    },
    development: !isProduction,
    respawn: isProduction,
    token: process.env.DISCORD_TOKEN
})

shardingManager.spawn();