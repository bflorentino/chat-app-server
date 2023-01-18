import { Message, MessageRes } from "../../types/interfaces";
import ServerResponse from "../ServerRes";

export default interface IChatServices {

    getChats(userName:string): Promise<ServerResponse>; 
    getUserLastTime(userName:string): Promise<ServerResponse>; 
    addNewMessage(message:Message,user_from:string, user_to:string) : Promise<MessageRes | null>;
}