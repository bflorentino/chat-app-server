import ServerResponse from "../ServerRes";
import ChatModel from "../../models/Chat";
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
}

export default ChatServices