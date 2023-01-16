import SocketManager from "../socket/SocketManager"
import { HttpStatus } from "./enums"

export interface User {
    _id? :string,
    user_name : string,
    name: string,
    last_name: string,
    email: string,
    password: string,
    phone? : string,
    last_active?:string
}

export interface Message{
    messageId?: string,
    user_from: string,
    time?: string,
    date?:string,
    content: string,
    was_seen: boolean,
}

export interface Chat {
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