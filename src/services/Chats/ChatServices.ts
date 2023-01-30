import ServerResponse from "../ServerRes";
import ChatModel from "../../models/Chat";
import IChatServices from "./IChatServices";
import connectToDb from "../../database/connection";
import DefaultResponses from '../../constants/index'
import { Chat, Message, MessageRes } from "../../types/interfaces";
import mongoose, { Types } from "mongoose";
import moment from "moment";
import { HttpStatus } from "../../types/enums";

module ChatServicesTypes {
    export type chatDocument = mongoose.Document<unknown, any, Chat> & Chat & Required<{_id: Types.ObjectId}>
    export type MsgActionResponse = Promise<MessageRes | HttpStatus | null >
}

class ChatServices implements IChatServices {
    
    constructor(){}

    public async getChats(userName:string):Promise<ServerResponse>{

        let response:ServerResponse
        
        try{
            await connectToDb()
            const chats:Chat[] = await ChatModel.find({$or : [{user_1:userName}, {user_2:userName}]})
    
            response = new ServerResponse()
            response.data =  this.transformArrayToObject(chats, (k) => k._id.toString())
        }
        catch(e){
            console.log(e)
            response = new ServerResponse(DefaultResponses.Server_Error)
        }
        return response
    }


    public async addNewMessage(message:Message, userFrom:string, userTo:string):Promise<MessageRes | Chat | null> {

        try{
            await connectToDb()

            // Check if already exists a chat with both users
            const chatExisting = await ChatModel.findOne({$or: [
                                                        {$and: [{user_1:userFrom}, {user_2:userTo}]}, 
                                                        {$and: [{user_2:userFrom ,user_1:userTo}]}
                                                    ]
                                                })
            
            let chatId:Types.ObjectId | undefined | null = chatExisting?._id

            // If chat doesn't exist, then create a chat with user
            if(!chatExisting){
                chatId = await this.createChat(userFrom, userTo)
            }

            if(!chatId){
                return null
            }
            
            // Update chat with sent message
            const messageToAdd = {...message, date:moment().format('M/D/YYYY'), time:moment().format('h:mm:ss a')}

            await ChatModel.updateOne({_id: chatId}, 
                                    {$push:{messages:[messageToAdd]}
                                })
            
            if(chatExisting){
                return {message:{...messageToAdd}, chatId:chatId.toString()}
            }

            // In case it was created a new chat it's neccessary to return a chat
            const newChat:Chat = await ChatModel.findById({_id:chatId}) as Chat 
            return newChat

        }
        catch(e){
            console.log(e)
        }
        return null
    }

    public editMessage = async(newMsg:Message, chatId:string, userEditing:string):ChatServicesTypes.MsgActionResponse => {

        if(!(userEditing === newMsg.user_from)) return HttpStatus.BAD_REQUEST

        try{
            await connectToDb()

            const chat = await this.getChatById(chatId)
            if(!chat) return null       
            
            chat.messages = chat.messages.map(mess => 
                                                mess.messageId === newMsg.messageId 
                                                ? {...mess, ...newMsg, edited:true} 
                                                : mess
                                            )
            await chat.save()

            return {message:{...newMsg}, chatId}
        }
        catch(e){
            console.log(e)
            return null
        }
    }

    public setMessagesRead = async(messages:string[], chatId:string):Promise<null| {[m:string]:string} > => {
        
        try{
            await connectToDb()

            const chat = await this.getChatById(chatId)
            if(!chat) return null  

            const messagesIdObj:{ [s:string] : string } = this.transformArrayToObject(messages, (k) => k)
            chat.messages = chat.messages.map(msg => messagesIdObj[msg.messageId as string] ? {...msg, was_seen:true} : msg)

            await chat.save()

            return messagesIdObj
        }
        catch(e){
            console.log(e)
        }
        return null
    }

    public deleteMessage = async (messageToDelete:Message, chatId:string, userDeleting:string):ChatServicesTypes.MsgActionResponse => {

        if(!(userDeleting === messageToDelete.user_from)) return HttpStatus.BAD_REQUEST
        
        try{
            await connectToDb()

            const chat = await this.getChatById(chatId)
            if(!chat) return null

            chat.messages = chat.messages.filter(msg => msg.messageId !== messageToDelete.messageId)
            
            await chat.save()

            return {message:messageToDelete, chatId}
        }
        catch(e){
            console.log(e)
            return null
        }
    }

    private async createChat(user_1:string, user_2:string):Promise<Types.ObjectId | null>{

        try{
            const model = new ChatModel({user_1, user_2})
            model.started_on = new Date().toLocaleDateString()

            if(model.validateSync()?.errors){
                return null
            }
            
            const chat = await model.save()

            return chat._id
        }
        catch(e){
            return null
        }
    }

    public getChatById = async(chatId:string):Promise<ChatServicesTypes.chatDocument| null> => {
        
        const _id = new mongoose.Types.ObjectId(chatId)
        const chat = await ChatModel.findById({_id})
        
        if(!chat) return null

        return chat
    }

    private transformArrayToObject = <T>(array:T[], propertyKeySelector:(k:T)=> string) => {

        const intoObject = array.reduce((acc, curr) => {
            Object.assign(acc, {[propertyKeySelector(curr)]: curr })
            return acc
        }, {})

        return intoObject
    }
}

export default ChatServices