import { chatServices } from "../../types/classes";
import {setApi, setDataReady, messagesToUpdate } from "./helpers";
import { httpServer } from "../../index";
import { Chat} from "../../types/interfaces";

const api = setApi()

beforeAll(async () => {
    await setDataReady()
})

describe("Send Message", () => {
    
   test("Should return a new chat and message should be saved successfully", async()=> {
       
       const res = await chatServices.addNewMessage({messageId:"lkajdflajda", 
                                        user_from:"bflorentino",  
                                        content:"Prueba de mensaje", 
                                        was_seen:false}, 
                                "bflorentino", "bryan") as Chat
    
        expect(res).toBeTruthy()
        expect(res).toHaveProperty("messages")
        expect(res.messages).toHaveLength(1)
        expect(res.messages[0]).toHaveProperty("content")
    })
})


describe("Chats", ()=> {

    test("Should return JSON object", async()=> {
        
        await api.get("/chats/bflorentino")
                .expect("Content-type", /application\/json/)
    })

    test("Should return one chat", async() => {
    
        const res = await api.get("/chats/bflorentino")

        expect(res.statusCode).toBe(200)
        expect(typeof(res.body._data)).toBe("object")
        expect(Object.values(res.body._data)).toHaveLength(1)
    })

    test("Shold return empty object", async()=> {
        
        const res = await api.get("/chats/bienvenido")
        expect(Object.values(res.body._data)).toHaveLength(0)
    })
})

describe("Update Message", ()=> {

    test("Should return null if a chat doesn't exist or objectId is invalid", async () => {

        const response = await chatServices.updateMessage(messagesToUpdate[0], "asdfadfweradsgasdf")
        expect(response).toBeNull()
    })

    test("Should update message successfully and return an object with message update", async () => {
        
        const response = await api.get("/chats/bflorentino")
        const chatId:string = Object.values(response.body._data as Chat[])[0]._id.toString()

        const messageUpdatedRes = await chatServices.updateMessage(messagesToUpdate[0], chatId)

        expect(messageUpdatedRes!.message).toHaveProperty("messageId")
        expect(messageUpdatedRes!.message.content).toBe(messagesToUpdate[0].content)
    })
})

afterAll(()=> {
    httpServer.close()
})