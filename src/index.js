import { ShardingManager } from 'kurasuta'
import { Intents } from 'discord.js'
import Path from 'path'
import mongoose from 'mongoose'
import Client from './Client'

import Logger from './Libraries/Logger'

const isProduction = process.env.NODE_ENV === 'production'
const shardingManager = new ShardingManager(Path.join(__dirname, 'Main'), {
    client: Client,
    clientOptions: {
        partials: ["USER", "GUILD_MEMBER", "MESSAGE", "CHANNEL", "REACTION"],
        intents: new Intents(Intents.All),
        publicKey: process.env.DISCORD_PUBLICKEY,
        clientID: process.env.DISCORD_CLIENTID,        
        token: process.env.DISCORD_TOKEN
    },
    development: !isProduction,
    respawn: isProduction,
    token: process.env.DISCORD_TOKEN
})
shardingManager.on('ready', (cluster) => {
    Logger.debug('index:ready', { pid: process.pid, isProduction })
})
shardingManager.on('shardReady', (shardId) => {
    Logger.debug('index:shardReady', { pid: process.pid, shardId })
})
shardingManager.on('shardReconnect', (shardId) => {
    Logger.debug('index:shardReconnect', { pid: process.pid, shardId })
})
shardingManager.on('shardResume', (replayed, shardId) => {
    Logger.debug('index:shardResume', { pid: process.pid, replayed, shardId })
})
shardingManager.on('shardDisconnect', (closeEvent) => {
    Logger.debug('index:shardDisconnect', { pid: process.pid, closeEvent })
})



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.once('open', () => {    
    Logger.debug('index:open', { })
    shardingManager.spawn();
})