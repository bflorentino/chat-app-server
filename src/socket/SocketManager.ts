import { Server as HttpServer } from 'http'
import { Socket, Server } from "socket.io";
import ChatServices from '../services/Chats/ChatServices';
import UsersService from '../services/Users/UsersServices';
import { HttpStatus, SocketEvents } from '../types/enums';
import { Message } from '../types/interfaces';

class SocketManager{

    private static _socketManager:SocketManager;
    private _io:Server;
    private _usersOnline:{ [ key:string ]:string }

    private constructor(server:HttpServer, private chatServices:ChatServices, private userServices:UsersService){
        this._usersOnline = {}
        
        // Socket Initialization
        this._io = new Server (server,
            {
                serveClient:false,
                pingInterval:10000,
                pingTimeout:5000,
                cookie:false,
                cors: {
                    origin:"*"
                }
            }
        )
        this._io.on(SocketEvents.connect, this.startSockets)
    }

    get usersOnline() {return this._usersOnline}
    
    get io() {return this._io}

    public static createSocketInstance(server:HttpServer, chatService:ChatServices, userServices:UsersService){
        if(!this._socketManager){
            this._socketManager = new SocketManager(server, chatService, userServices)
        }
    }

    public static getSocketInstance():SocketManager{
        return this._socketManager
    }

    private startSockets = (socket:Socket) => {
        
        socket.on(SocketEvents.userConnected, (user:string) => {

            this.setUserOnline(user, socket.id)
        
            this.sendSocketMessage(
                        SocketEvents.userConnected, 
                        Object.keys(this.usersOnline), 
                        this.usersOnline
                    )
        })

        socket.on(SocketEvents.sendMessage, async (message:Message, userFrom:string, userTo:string) => {
            
            const res = await this.chatServices.addNewMessage(message, userFrom, userTo)
            
            if(res){
                this.sendSocketMessage(SocketEvents.messageReceived, [userFrom, userTo], res )
                return
            }
            this.sendSocketMessage(SocketEvents.errorInMessageSend, [userFrom] )
        })

        socket.on(SocketEvents.editMessage, async (message:Message,userFrom:string, userTo:string, chatId:string ) => {
            
            const res = await this.chatServices.editMessage(message, chatId, userFrom)

            if(res && res !== HttpStatus.BAD_REQUEST){
                this.sendSocketMessage(SocketEvents.messagedEdited, [ userFrom, userTo ], res)
            }
        })

        socket.on(SocketEvents.readMessage, async(messages:string[], userFrom, userTo, chatId:string) => {

            const res = await this.chatServices.setMessagesRead(messages, chatId)
            
            if(res){
                this.sendSocketMessage(SocketEvents.messageRead, [userFrom, userTo], {messagesId:res, chatId} )
            }
        })

        socket.on(SocketEvents.deleteMessage, async(message:Message, userFrom:string, userTo:string, chatId:string) => {

            const res = await this.chatServices.deleteMessage(message, chatId, userFrom)

            if(res && res !== HttpStatus.BAD_REQUEST){
                this.sendSocketMessage(SocketEvents.messageDeleted, [ userFrom, userTo ], res)
            }
        })

        socket.on(SocketEvents.disconnect, async () => {

            const userOff = Object.keys(this._usersOnline).find(user => this._usersOnline[user] === socket.id )
            
            if(userOff){
                this.setUserOffline(userOff)
                await this.userServices.updateUserLastTime(userOff)
                this.sendSocketMessage(SocketEvents.userDisconnected, Object.keys(this._usersOnline), userOff)
            }
        })
    }
    
    private setUserOnline = (user:string, id:string) =>{
        this._usersOnline[user] = id
    }
    
    private setUserOffline = (user:string) => {
        delete this._usersOnline[user]
    }

    public isUserOnline = (user:string):boolean =>{
        return this._usersOnline.hasOwnProperty(user)
    }

    private sendSocketMessage = (name:SocketEvents, usersTo:string[], payload?:Object ) =>{
        usersTo.forEach(user => {
           payload
            ? 
            this._io.to(this.usersOnline[user]).emit(name, payload)
            :
            this._io.to(this.usersOnline[user]).emit(name)
        })
    }
}

export default SocketManager