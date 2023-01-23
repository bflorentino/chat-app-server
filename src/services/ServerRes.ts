import { ServerRes } from "../types/interfaces";
import { HttpStatus } from "../types/enums";

class ServerResponse implements ServerRes {
    
    private _message:string | null = null;
    private _data:Object | null = {};
    private _status:number = HttpStatus.OK;
    private _success:boolean = true;

    constructor(serverRes?:ServerRes){

        if(serverRes){
            this._data = serverRes.data
            this._status = serverRes.status
            this._success = serverRes.success
            this._message = serverRes.message
        }
    }

    set message(message:string){
        this._message = message
    }

    get message(){return this._message as string}

    set data(data:Object){
        this._data = data
    }

    get data(){return this._data as Object}

    set status(status:HttpStatus){
        this._status = status
    }

    get status(){return this._status}

    set success(success:boolean){
        this._success = success
    }

    get success(){return this._success}
}

export default ServerResponse