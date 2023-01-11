import ServerResponse from "../ServerRes";

export default interface IChatServices {

    getChats(userName:string)    : Promise<ServerResponse>; 
 //   addNewMessage(chatId:string) : Promise<ServerResponse>;
    
}