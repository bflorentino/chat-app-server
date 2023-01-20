import { User } from "../../types/interfaces"
import { ServerRes } from "../../types/interfaces"

interface IUsers {
    registerUser(user:User): Promise<ServerRes>,
    loginUser(userName:string, password:string):Promise<ServerRes>
    getMatchedUsers(searchString:string):Promise<ServerRes>
    getUserLastTime(userName:string): Promise<ServerRes>; 
    updateUserLastTime(userName:string):Promise<Boolean>
}

export default IUsers