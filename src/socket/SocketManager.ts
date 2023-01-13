import { Server as HttpServer } from 'http'
import { Socket, Server } from "socket.io";
import { SocketEvents } from '../types/enums';

class SocketManager{

    private static _socketManager:SocketManager;
    private _io:Server;
    private _usersOnline:{ [ key:string ]:string }

    private constructor(server:HttpServer){
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
        this._io.on("connect", this.startSockets)
    }

    get usersOnline() {return this._usersOnline}
    
    get io() {return this._io}

    public static createSocketInstance(server:HttpServer){
        if(!this._socketManager){
            this._socketManager = new SocketManager(server)
        }
    }

    public static getSocketInstance():SocketManager{
        return this._socketManager
    }

    private startSockets(socket:Socket) {

        console.log("So, there's a new connection to socket IO from " + socket.id )
        
        socket.on(SocketEvents.userConnected, (user:string) => {
            this.setUserOnline(user, socket.id)
        })

        socket.on(SocketEvents.disconnect, (user:string) => {
            this.setUserOffline(user)
        })
    }
    
    private setUserOnline(user:string, id:string){
        this._usersOnline[user] = id
    }
    
    private setUserOffline(user:string){
        delete this._usersOnline[user]
    }

    public isUserOnline(user:string):boolean{
        return this._usersOnline.hasOwnProperty(user)
    }
}

export default SocketManager