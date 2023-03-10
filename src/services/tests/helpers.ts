import { application } from "../../../index"
import supertest from "supertest"
import connectToDb from "../../database/connection"
import UserModel from '../../models/User'
import ChatModel from "../../models/Chat"
import moment from "moment"
import { Chat } from "../../types/interfaces"

export const Api = supertest(application)

export const initialUsers = [
    {
        user_name:"bflorentino",
        name:"Jose",
        last_name:"Rodriguez",
        email:"jose@hotmail.com",
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        last_active:moment("2023-01-10 09:15:00").format("MMMM DD YYYY, h:mm a"),
        profilePic:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FArchivo%3APierre-Person.jpg&psig=AOvVaw0oV8DOk-ZR8EJ__RWe-X4e&ust=1674853558193000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCLiYy-uR5vwCFQAAAAAdAAAAABAE",
        _id:"jose@hotmail.com"
    },
    {
        user_name:"bryan",
        name:"Jose",
        last_name:"Manuel",
        email:"josem@hotmail.com",
        profilePic: null,
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        _id:"josem@hotmail.com"
    },
    {
        user_name:"bienvenido",
        name:"Bienvenido",
        last_name:"Rodriguez",
        email:"bienvenido@hotmail.com",
        profilePic:null,
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        _id:"bienvenido@hotmail.com"
    }   
]

export const messagesToSend = [
    {
        messageId:"lkajdflajda", 
        user_from:"bflorentino",    
        content:"Prueba de mensaje", 
        was_seen:false,
        edited:false
    },    
    {
        messageId:"rljknklolnlnj", 
        user_from:"bflorentino",  
        content:"Este es el segundo mensaje enviado al chat", 
        was_seen:false,
        edited:false
    },

]

export const messagesToUpdate = [
    {   
        messageId:"lkajdflajda", 
        user_from:"bflorentino",
        content:"Mensaje Editado",
        was_seen:false,
        edited:true
    }
]

export const setDataReady = async() => {
    
    await connectToDb()
    await UserModel.deleteMany({})
    await ChatModel.deleteMany({})

    for(const user of initialUsers){
        const userToSave = new UserModel(user)
        await userToSave.save()
    }
}

export const getChatId = async():Promise<string> => {
    
    const responseChatId = await Api.get("/chats/bflorentino")
    const chatId:string = Object.values(responseChatId.body._data as Chat[])[0]._id.toString()

    return chatId
}