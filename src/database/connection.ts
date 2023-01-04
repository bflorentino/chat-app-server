import mongoose from "mongoose";
import variables from './../config/config'

const connectToDb = async() => {
    try{
        await mongoose.connect(variables.connectionString as string)
    }
    catch(e){
        console.log("Sorry, a connection error ocurred")
        console.log(e)
    }
}

export default connectToDb