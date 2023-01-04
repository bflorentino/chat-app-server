import { Server as HttpServer } from 'http'
import { Socket, Server } from "socket.io";
import { v4 } from 'uuid'
import { UserOnline } from '../types/interfaces';

class SocketManager{

    private static _socketManager:SocketManager;
    private _io:Server;
    private _users:{ [ key:string ]:UserOnline }

    private constructor(server:HttpServer){
        this._users = {}
        
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
    }

    get users() {return this._users}

    get io() {return this._io}

    public static getSocketInstance(server:HttpServer):SocketManager{
        if(!this._socketManager){
            this._socketManager = new SocketManager(server)
        }
        return this._socketManager
    }
}

export default SocketManager