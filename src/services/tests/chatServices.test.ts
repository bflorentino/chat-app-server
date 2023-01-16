import { chatServices } from "../../types/classes";
import { api, initialUsers, setDataReady } from "./helpers";

beforeAll(async () => {
    await setDataReady()
})

describe("Send Message", () => {
    
   test("Message should be saved successfully", async()=> {
       
       const res = await chatServices.addNewMessage({messageId:"lkajdflajda", 
                                        user_from:"bflorentino",  
                                        content:"Prueba de mensaje", 
                                        was_seen:false}, 
                                "bflorentino", "bryan")
    
        expect(res).toHaveProperty("content")    
    })
   })