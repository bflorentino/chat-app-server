import IUserServices from "../services/Users/IUserServices"
import { Request, Response } from 'express' 
import { ServerRes } from "../types/interfaces"
import FileUtilities from "../tools/FilesUtilities"

class UsersController {

    constructor(private userServices:IUserServices, private fileUtilities:FileUtilities){}

    public postNewUser = async (req:any, res:Response) =>{

        let fullPathToPic:string|null = null;
    
        //Save image if exists
        if(req.files){
            const pictureName = await this.fileUtilities.saveImage(req.files.profilePic.data, "profileImg")
            fullPathToPic = `${req.protocol}://${req.get("host")}/ProfilePic/${pictureName}`
        }

        const result:ServerRes = await this.userServices.registerUser({...req.body, profilePic:fullPathToPic})
        
        res.statusCode = result.status
        res.send(result)
    }

    public login = async(req:Request, res:Response) => {
        const result:ServerRes = await this.userServices.loginUser(req.params.user, req.params.psw)
        res.statusCode = result.status
        res.send(result)
    }
    
    public matchedUsers = async (req:Request, res:Response) => {  
        const result:ServerRes = await this.userServices.getMatchedUsers(req.params.searchString)
        res.statusCode = result.status
        res.send(result)
    }

    public getUserLastTime = async(req:Request, res:Response) => {
        const result:ServerRes = await this.userServices.getUserLastTime(req.params.userName)
        res.statusCode = result.status
        res.send(result)
    }

    public getUserData = async(req:Request, res:Response) => {
        const result:ServerRes = await this.userServices.getUserData(req.params.userName)
        res.statusCode = result.status
        res.send(result)
    }
}

export default UsersController