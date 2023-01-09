import { ServerRes, User  } from "../../types/interfaces";
import IUserServices from "./IUserServices";
import PasswordUtilities from "../../tools/PasswordUtilities";
import TokenUtilities from "../../tools/TokenUtilities";
import connectToDb from "../../database/connection";
import { HttpStatus } from "../../types/enums";
import DefaultResponse from '../../constants/index'
import UserModel from "../../models/User";
import ServerResponse from "../ServerRes";
import moment from 'moment'

class UsersService implements IUserServices {

   constructor(private passwordUtility:PasswordUtilities, private tokenUtility:TokenUtilities){}

   public async registerUser(user: User):Promise<ServerRes> {

        let response:ServerRes;
        
        try{
            await connectToDb()

            const userToAdd = {...user }
            userToAdd.password = await this.passwordUtility.encriptPassword(user.password)
            userToAdd.last_active = moment().format('MMMM Do YYYY, h:mm:ss a')

            const model = new UserModel(userToAdd)
            model._id = user.email

            await model.save()

            const token = this.tokenUtility.getToken(user.user_name)
            response = new ServerResponse()
            response.status = HttpStatus.CREATED
            
            response.data = {userName:user.user_name, 
                            name:user.name, 
                            lastName:user.last_name,
                            email:user.email, 
                            token
                        }
        }
        catch(e : unknown) {

            if(e instanceof Error && e.message.startsWith("E11000")){
                response = new ServerResponse(DefaultResponse.Server_Bad_Request)
                response.message = "Probably this user name is already taken or an account with this email already exists"
            }
            else{
                response = new ServerResponse(DefaultResponse.Server_Error)
            }
        }
        return response
    }

    public async loginUser(user:string, password:string):Promise <ServerRes> {

        let response:ServerRes

        try{
            await connectToDb()

            const userFound = await UserModel.findOne({user_name:user})

            if(userFound && this.passwordUtility.compareHash(password, userFound.password) ){

                    const token = this.tokenUtility.getToken(userFound.user_name)

                    response = new ServerResponse()

                    response.data = {token, 
                                    userName:userFound.user_name,
                                    email:userFound.email,
                                    name: userFound.name,
                                    lastName:userFound.last_name
                                }
                    }
            else {
                response = new ServerResponse(DefaultResponse.Server_Not_Found)
                response.message = "Your User or Password are incorrect"
            }
        }
        catch(e){
            console.log(e)
            response = new ServerResponse(DefaultResponse.Server_Error)
        }
        
        return response
    }

    public async getMatchedUsers(searchString: string): Promise<ServerRes> {

        let response: ServerResponse

        try{
            await connectToDb()

            const matchedUsers = await UserModel
                                        .find({user_name: { $regex:"^" + searchString + "i"}})
                                        .select('user_name name last_name')
            
            response = new ServerResponse()
            response.data = matchedUsers
        }
        catch(e){
            console.error(e)
            response = new ServerResponse(DefaultResponse.Server_Error)
        }
        return response
    }
}

export default UsersService