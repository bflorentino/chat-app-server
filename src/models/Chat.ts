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
        type: [{ 
                messageId:String,
                user_from:String, 
                content: String, 
                time: String,
                date: String,
                was_seen:Boolean, 
                edited:Boolean
            }],
        
        default : []
    },
    started_on : {
        type: String,
        required: true
    },   
})

export default model<Chat>("Chats", ChatSchema)