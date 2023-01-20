import { Chat, Message, MessageRes } from "../../types/interfaces";
import { ServerRes } from "../../types/interfaces"

export default interface IChatServices {

    getChats(userName:string): Promise<ServerRes>; 
    addNewMessage(message:Message,user_from:string, user_to:string) : Promise<MessageRes | Chat | null>;
}