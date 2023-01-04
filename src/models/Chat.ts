import { Schema, model } from 'mongoose'
import { Chat } from '../types/interfaces'

const ChatSchema = new Schema<Chat>({
    user_1 : {
        type: String,
        required: true
    },
    user_2: {
        type: String,
        required: true,
    },
    messages: {
        type: [{user_from:String, 
                content: String, 
                time: String, 
                was_seen:Boolean}]
    },
    started_on : {
        type: Date,
        required: true
    }
})

export default model<Chat>("Chats", ChatSchema)