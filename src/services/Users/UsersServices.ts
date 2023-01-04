import { ServerRes, User  } from "../../types/interfaces";
import IUserServices from "./IUserServices";
import PasswordUtilities from "../../tools/PasswordUtilities";
import TokenUtilities from "../../tools/TokenUtilities";
import connectToDb from "../../database/connection";
import { HttpStatus } from "../../types/enums";
import DefaultResponse from '../../constants/index'
import UserModel from "../../models/User";
import ServerResponse from "../ServerRes";

class UsersService implements IUserServices {

    private readonly _tokenUtility:TokenUtilities
    private readonly _passwordUtility:PasswordUtilities

    constructor(psUtility:PasswordUtilities, tokenUtility:TokenUtilities){
        this._tokenUtility = tokenUtility
        this._passwordUtility = psUtility
    }

   public async registerUser(user: User):Promise<ServerRes> {

        let response:ServerRes;
        
        try{
            await connectToDb()

            const userToAdd = {...user }
            userToAdd.password = await this._passwordUtility.encriptPassword(user.password)

            const model = new UserModel(userToAdd)
            model._id = user.email

            await model.save()

            const token = this._tokenUtility.getToken(user.user_name)

            response = new ServerResponse()
            
            response.status = HttpStatus.CREATED
            
            response.data = {userName:user.user_name, 
                            name:user.name, 
                            lastName:user.last_name,
                            email:user.email, 
                            token
                        }
                
        }
        catch(e){
            console.log(e)
            response = new ServerResponse(DefaultResponse.Server_Error)
        }
        return response
    }

    public async loginUser(user:string, password:string):Promise <ServerRes> {

        let response:ServerRes

        try{
            const userFound = await UserModel.findOne({user_name:user})

            if(userFound && this._passwordUtility.compareHash(password, userFound.password) ){

                    const token = this._tokenUtility.getToken(userFound.user_name)

                    response = new ServerResponse()

                    response.data = {token, 
                                    userName:userFound.user_name,
                                    email:userFound.email,
                                    name: userFound.name,
                                    lastName:userFound.last_name
                                }
                    
                    }
            else{
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
}

export default UsersService