import { User } from "../../types/interfaces"
import { ServerRes } from "../../types/interfaces"

interface IUsers {
    registerUser(user:User): Promise<ServerRes>,
    loginUser(userName:string, password:string):Promise<ServerRes>
    getMatchedUsers(searchString:string):Promise<ServerRes>
}

export default IUsers