import jwt from 'jsonwebtoken'
import variables from '../config/config'

class TokenUtilities {

    private readonly secret:string = ""

    constructor(){
        this.secret = variables.secretToken as string
    }

    public getToken(user:string):string{
        
        const token = jwt.sign({user}, this.secret, {expiresIn:'96h'})
        return token
    }
}

export default TokenUtilities