import { chatServices } from "../../types/classes";
import {setApi, initialUsers, setDataReady } from "./helpers";
import { httpServer } from "../../index";
import { Chat} from "../../types/interfaces";

const api = setApi()

beforeAll(async () => {
    await setDataReady()
})

describe("Send Message", () => {
    
   test("Message should be saved successfully", async()=> {
       
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

afterAll(()=> {
    httpServer.close()
})