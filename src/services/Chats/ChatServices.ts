import ServerResponse from "../ServerRes";
import ChatModel from "../../models/Chat";
import UserModel from "../../models/User";
import IChatServices from "./IChatServices";
import connectToDb from "../../database/connection";
import DefaultResponses from '../../constants/index'
import { Chat } from "../../types/interfaces";

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
}

export default ChatServices