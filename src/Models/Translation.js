import { model, Schema } from 'mongoose'

const TranslationSchema = new Schema({
    hash: {
        type: String,
    },
    text: {
        type: String
    },
    target: [
        {
            lang: {
                type: String
            },
            text: {
                type: String
            }
        }
    ]
})

export default model('Translation', TranslationSchema)