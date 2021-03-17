import { model, schema } from 'mongoose'

const RoleSchema = new Schema({
    id: {
        type: String
    }
})

export default model('Role', RoleSchema)