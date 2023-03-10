import { HttpStatus } from "./enums"
import { Types } from "mongoose"

export interface User {
    _id? :string,
    user_name : string,
    name: string,
    last_name: string,
    email: string,
    password: string,
    phone? : string,
    profilePic:string | null,
    last_active?:string
}

export interface Message{
    messageId?: string,
    user_from: string,
    time?: string,
    date?:string,
    content: string,
    was_seen: boolean,
    edited:boolean
}

export interface MessageRes {
    message: Message,
    chatId:string
}

export interface Chat {
    _id:Types.ObjectId
    user_1: string,
    user_2: string,
    started_on: string,
    messages:Message[]
}

export interface UserOnline {
    user_name: string
}

export interface ServerRes {
    message: string | null,
    status:HttpStatus,
    data: Object | null,
    success : boolean
}