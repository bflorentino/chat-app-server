import mongoose from "mongoose";
import variables from './../config/config'

const connectionString = variables.nodeEnv === "test" 
    ? variables.connectionStringTest
    : variables.connectionString 

const connectToDb = async() => {
    try{
        await mongoose.connect(connectionString as string)
    }
    catch(e){
        console.log("Sorry, a connection error ocurred")
        console.log(e)
    }
}

export default connectToDb