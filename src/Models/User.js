import { model, Schema } from 'mongoose'

const GuildSchema = new Schema({    
    id: {
        type: String
    }
})

export default model('User', GuildSchema)