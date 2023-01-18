import { Server as HttpServer } from 'http'
import { Socket, Server } from "socket.io";
import ChatServices from '../services/Chats/ChatServices';
import { SocketEvents } from '../types/enums';
import { Message } from '../types/interfaces';

class SocketManager{

    private static _socketManager:SocketManager;
    private _io:Server;
    private _usersOnline:{ [ key:string ]:string }

    private constructor(server:HttpServer, private chatServices:ChatServices){
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

    public static createSocketInstance(server:HttpServer, chatService:ChatServices){
        if(!this._socketManager){
            this._socketManager = new SocketManager(server, chatService)
        }
    }

    public static getSocketInstance():SocketManager{
        return this._socketManager
    }

    private startSockets = (socket:Socket) => {
        
        socket.on(SocketEvents.userConnected, (user:string) => {

            this.setUserOnline(user, socket.id)
            
            const { [user]:key, ...usersToSendConnection } = this.usersOnline

            this.sendSocketMessage(
                        SocketEvents.userConnected, 
                        Object.keys(usersToSendConnection), 
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

        socket.on(SocketEvents.disconnect, (user:string) => {
            this.setUserOffline(user)
            this.sendSocketMessage(SocketEvents.userDisconnected, Object.keys(this.usersOnline), socket.id)
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