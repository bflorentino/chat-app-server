import { Request, Response } from 'express' 
import IChatServices from '../services/Chats/IChatServices'
import { ServerRes } from '../types/interfaces'
class ChatController {

    // ONLY TO MANAGE METHODS AND SERVICES NOT MANAGED BY WEBSOCKETS PROTOCOL
    constructor(private chatServices:IChatServices){}

    public async getChats(req:Request, res:Response){
        const result:ServerRes = await this.chatServices.getChats(req.params.userName)
        res.statusCode = result.status
        res.send(result)
    }
}

export default ChatController