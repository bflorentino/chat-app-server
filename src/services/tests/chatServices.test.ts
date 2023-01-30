import { chatServices } from "../../types/classes";
import {Api, setDataReady, messagesToUpdate, messagesToSend, getChatId } from "./helpers";
import { httpServer } from "../../index";
import { Chat, MessageRes} from "../../types/interfaces";
import { HttpStatus } from "../../types/enums";

beforeAll(async () => {
    await setDataReady()
})

describe("Send Message", () => {
    
   test("Should return a new chat and message should be saved successfully", async()=> {
       
       const res = await chatServices.addNewMessage(messagesToSend[0],"bflorentino", "bryan") as Chat
       
        expect(res).toBeTruthy()
        expect(res.messages).toHaveLength(1)
        expect(res.messages[0]).toHaveProperty("content")
    })
    
    test("Should return a MessageRes object when sending a message in a chat existing", async()=> {
        
        const response = await chatServices.addNewMessage(messagesToSend[1],"bflorentino", "bryan") as MessageRes

        expect(response).toBeTruthy()
        expect(response).toHaveProperty("chatId")
        expect(response.message.content).toBe(messagesToSend[1].content)
    })
})


describe("Chats", ()=> {

    test("Should return JSON object", async()=> {
        
        await Api.get("/chats/bflorentino")
                .expect("Content-type", /application\/json/)
    })

    test("Should return one chat", async() => {
    
        const res = await Api.get("/chats/bflorentino")

        expect(res.statusCode).toBe(200)
        expect(typeof(res.body._data)).toBe("object")
        expect(Object.values(res.body._data)).toHaveLength(1)
    })

    test("Shold return empty object", async()=> {
        
        const res = await Api.get("/chats/bienvenido")
        expect(Object.values(res.body._data)).toHaveLength(0)
    })
})

describe("Edit Message", ()=> {

    test("Should return null if a chat doesn't exist or objectId is invalid", async () => {

        const response = await chatServices.editMessage(messagesToUpdate[0], "asdfadfweradsgasdf", "bflorentino")
        expect(response).toBeNull()
    })

    test("Should return Bad Request if user editing message is not who sent it originally", async()=> {

        const chatId = await getChatId()  
        const response = await chatServices.editMessage(messagesToUpdate[0], chatId, "bryan" )

        expect(response).toBe(HttpStatus.BAD_REQUEST)
    })

    test("Should edit message successfully and return an object with message update", async () => {

        const chatId = await getChatId()
        const messageEditRes = await chatServices.editMessage(messagesToUpdate[0], chatId, "bflorentino") as MessageRes

        expect(messageEditRes!.message).toHaveProperty("messageId")
        expect(messageEditRes!.message.content).toBe(messagesToUpdate[0].content)
        expect(messageEditRes!.message.edited).toBe(true)
    })
})

describe("Messages Read Confirmation", ()=> {

    test("Should return null with unexisting or invalid chat Id", async () => {
        const readResponse = await chatServices.setMessagesRead([], "lakjdfaer")
        expect(readResponse).toBeNull()
    })

    test("Should return an empty object if passsed an empty array", async ()=> {

        const chatId = await getChatId()
        const readResponse = await chatServices.setMessagesRead([], chatId)

        expect(Object.keys(readResponse as Object).length).toBe(0)
    })

    test("Should return an object with two keys (messagesId) if passed a 2 elements array", async()=> {

        const chatId = await getChatId()
        const readResponse = await chatServices.setMessagesRead([messagesToSend[0].messageId, messagesToSend[1].messageId], chatId)

        expect(readResponse).not.toBeNull()
        expect(Object.keys(readResponse as Object).length).toBe(2)

        if(readResponse){
            expect(readResponse[messagesToSend[0].messageId]).toBe(messagesToSend[0].messageId)
            expect(readResponse[messagesToSend[1].messageId]).toBe(messagesToSend[1].messageId)
        }
    })
})

describe("Delete Message", ()=> {

    test("Should return null if chat doesn't exist or objectId(chatId) is invalid", async ()=> {

        const response = await chatServices.deleteMessage(messagesToUpdate[0], "asdfadfweradsgasdf", "bflorentino")
        expect(response).toBeNull()
    })

    test("Should return Bad Request if user deleting message is not who sent it originally", async()=> {

        const chatId = await getChatId()  
        const response = await chatServices.deleteMessage(messagesToUpdate[0], chatId, "bryan" )

        expect(response).toBe(HttpStatus.BAD_REQUEST)
    })

    test("Should delete message and return a MessageRes Object", async()=> {

        const chatId = await getChatId()
        const messageDeletedRes = await chatServices.deleteMessage(messagesToUpdate[0], chatId, "bflorentino") as MessageRes
        
        expect(messageDeletedRes.message).toHaveProperty("messageId")
        expect(messageDeletedRes.message.content).toBe(messagesToUpdate[0].content)
    })
})

afterAll(()=> {
    httpServer.close()
})