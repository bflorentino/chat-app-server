import IUserServices from "../services/Users/IUserServices"
import { Request, Response } from 'express' 
import { ServerRes } from "../types/interfaces"

class UsersController {

    private readonly _usersServices:IUserServices

    constructor(userServices:IUserServices){
        this._usersServices = userServices
    }

    public async postNewUser(req:Request, res:Response){
        
        const result:ServerRes = await this._usersServices.registerUser(req.body)
        res.statusCode = result.status
        res.send(result)
    }

    public async login(req:Request, res:Response){
        const result:ServerRes = await this._usersServices.loginUser(req.params.user, req.params.password)
        res.statusCode = result.status
        res.send(result)
    }
}

export default UsersController