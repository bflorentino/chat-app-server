import { httpServer } from '../../index'
import { userServices } from '../../types/classes'
import { setDataReady, initialUsers } from './helpers'
import { Api } from './helpers'

beforeAll(async ()=> {
    await setDataReady()
})

// Testing POST new users
describe("Testing POST new users", ()=> {
    
    test('A valid user', async()=> {
        const user =     {
            user_name:"bflorentin0",
            name:"Florentino",
            last_name:"Rodriguez",
            email:"flore@hotmail.com",
            password:"1234567"
        }

        await Api
                .post('/authentication/register')
                .send(user)
                .expect(201)
                .expect('Content-type', /application\/json/)

        const response = await Api.get('/searchUsers/bflorentin0')
        expect(response.body._data).toHaveLength(1)
    })
    
    test('An invalid user cannot be added (repeated email)', async()=>{
        
        const user =     {
            user_name:"bflorentin23",
            name:"Florentino",
            last_name:"Rodriguez",
            email:"flore@hotmail.com",
            password:"1234567"
        }
            await Api
                .post('/authentication/register')
                .send(user)
                .expect(400)
    })    
})

// Testing login service
describe("Testing login service", ()=> {

    test("Return a Json Object", async()=> {
        await   Api
                .get('/authentication/login/bflorentin0/1234567')
                .expect('Content-type', /application\/json/)
    })

    test('User valid access', async()=> {

        const res = await Api.get('/authentication/login/bflorentin0/1234567')

        expect(res.body._status).toBe(200)
        expect(res.body._data).toHaveProperty("token")
        expect(res.body._data).toHaveProperty("name")
        expect(res.body._data).toHaveProperty("lastName")
        expect(res.body._data).toHaveProperty("userName")
        expect(res.body._data).toHaveProperty("email")
    })

    test("User invalid access with invalid userName or Password", async()=> {
        await Api
              .get('/authentication/login/bflorentin0/123456')
              .expect(404)
    })
})

// Testing Get users matching with a search string
describe("Testing users search", ()=> {
    
    test('Returns a JSON Object', async ()=>{
        await Api
            .get('/searchUsers/b')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are users matching with the string', async()=> {
        const response = await Api.get('/searchUsers/b')
        expect(response.body._data).toHaveLength(initialUsers.length + 1)
    })
    
    test('There are not users matching with the string', async()=> {
        const response = await Api.get('/searchUsers/bxx')
        expect(response.body._data).toHaveLength(0)
    })
    
    test('There is only one user matching with the string', async()=> {
        const response = await Api.get('/searchUsers/bflorentino')
        expect(response.body._data).toHaveLength(1)
    })
    
    test('User matching is bflorentino', async()=> {
        const response = await Api.get('/searchUsers/bflorentino')
        expect(response.body._data[0].user_name).toBe('bflorentino')
    })
})

describe ("User Last Time", ()=>{
    
    test("Last time should be January 10 2023, 9:15 am", async()=> {

        const response = await Api.get('/lastTime/bflorentino')
        expect(response.body._status).toBe(200)
        expect(response.body._data).toBe("January 10 2023, 9:15 am")
    })

    test("Should update last Time and return true", async()=> {

        const response = await userServices.updateUserLastTime('bflorentino')
        expect(response).toBe(true)

        const newRes = await Api.get('/lastTime/bflorentino')
        expect(newRes.body._data.last_active).not.toBe("January 10th 2023, 9:15 am")
    })
})

describe ("Get User Names and Profile picture", () => {
    
    test("Should return an object with user names and profile picture", async () => {

        const response = await Api.get("/chat/bflorentino")

        expect(response.status).toBe(200)
        expect(response.body._data).toHaveProperty("name")
        expect(response.body._data).toHaveProperty("last_name")
        expect(response.body._data.profilePic).toBe(initialUsers[0].profilePic)
    })

    test("Should return an objecto with profilePic null", async () =>{
        const response = await Api.get("/chat/bienvenido")
        expect(response.body._data.profilePic).toBeNull()
    })
})

afterAll(()=> {
    httpServer.close()
})