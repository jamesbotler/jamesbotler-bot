import { model, Schema } from 'mongoose'

const TextChannelSchema = new Schema({    
    id: {
        type: String
    }
})

export default model('TextChannel', TextChannelSchema)