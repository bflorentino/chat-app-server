import IUserServices from "../services/Users/IUserServices"
import { Request, Response } from 'express' 
import { ServerRes } from "../types/interfaces"

class UsersController {

    constructor(private userServices:IUserServices){}

    public async postNewUser(req:Request, res:Response){
        const result:ServerRes = await this.userServices.registerUser(req.body)
        res.statusCode = result.status
        res.send(result)
    }

    public async login(req:Request, res:Response){
        const result:ServerRes = await this.userServices.loginUser(req.params.user, req.params.psw)
        res.statusCode = result.status
        res.send(result)
    }
    
    public async matchedUsers(req:Request, res:Response) {  
        const result:ServerRes = await this.userServices.getMatchedUsers(req.params.searchString)
        res.statusCode = result.status
        res.send(result)
    }

    public async getUserLastTime(req:Request, res:Response){
        const result:ServerRes = await this.userServices.getUserLastTime(req.params.userName)
        res.statusCode = result.status
        res.send(result)
    }
}

export default UsersController