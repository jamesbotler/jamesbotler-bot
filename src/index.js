import { ShardingManager } from 'kurasuta'
import Path from 'path'
import mongoose from 'mongoose'
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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.once('open', () => {
    shardingManager.spawn();
})