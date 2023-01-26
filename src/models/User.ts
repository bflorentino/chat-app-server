import { Schema, model } from "mongoose";
import { User } from "../types/interfaces";

const UserSchema = new Schema<User>({
    
    _id:String,

    user_name : {
        type:String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required:true
    },
    last_name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    last_active: {
        type: String,
    },
    phone: {
        type: String
    },
    profilePic:{
        type: String,
        default:null
    }
}, {_id:false})

export default model<User>("Users", UserSchema)