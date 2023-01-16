import ServerResponse from "../ServerRes";
import ChatModel from "../../models/Chat";
import UserModel from "../../models/User";
import IChatServices from "./IChatServices";
import connectToDb from "../../database/connection";
import DefaultResponses from '../../constants/index'
import { Chat, Message } from "../../types/interfaces";
import { Types } from "mongoose";
import moment from "moment";

class ChatServices implements IChatServices {

    public async getChats(userName:string):Promise<ServerResponse>{

        let response:ServerResponse
        
        try{
            await connectToDb()
            const chats:Chat[] = await ChatModel.find({$or : [{user_1:userName}, {user_2:userName}]})
    
            response = new ServerResponse()
            response.data = chats
        }
        catch(e){
            console.log(e)
            response = new ServerResponse(DefaultResponses.Server_Error)
        }
        return response
    }

    public async getUserLastTime(userName:string):Promise<ServerResponse>{
        let response:ServerResponse
        
        try{
            await connectToDb()
            const lastTime = await UserModel.find({user_name:userName}).select('last_active')
    
            response = new ServerResponse()
            response.data = lastTime as object
        }
        catch(e){
            console.log(e)
            response = new ServerResponse(DefaultResponses.Server_Error)
        }
        return response
    }

    public async addNewMessage(message:Message, userFrom:string, userTo:string):Promise<Message | null> {

        //let response:ServerResponse = new ServerResponse()

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
                // response = new ServerResponse(DefaultResponses.Server_Error)
                // return response
                return null
            }
            
            // Update chat with sent message
            
            const messageToAdd = {...message, date:moment().format('MMMM Do YYYY'), time:moment().format('h:mm:ss a')}

            await ChatModel.updateOne({_id: chatId}, 
                                    {$push:{messages:[messageToAdd]}
                                })
            
            // response = new ServerResponse()
            // response.data = message
            return messageToAdd
        }
        catch(e){
            console.log(e)
            //response = new ServerResponse(DefaultResponses.Server_Error)
        }

        return null
    }

    private async createChat(user_1:string, user_2:string):Promise<Types.ObjectId | null>{

        try{
            const model = new ChatModel({user_1, user_2})
            model.started_on = new Date().toLocaleDateString()

            if(model.validateSync()?.errors){
                return null
            }
            
            const chatId = await model.save()

            return chatId._id
        }
        catch(e){
            return null
        }
    }
}

export default ChatServices