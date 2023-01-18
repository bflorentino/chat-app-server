import { httpServer } from '../../index'
import { setDataReady, initialUsers } from './helpers'
import { setApi } from './helpers'

const api = setApi()

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

        await api
                .post('/authentication/register')
                .send(user)
                .expect(201)
                .expect('Content-type', /application\/json/)

        const response = await api.get('/searchUsers/bflorentin0')
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
            await api
                .post('/authentication/register')
                .send(user)
                .expect(400)
    })    
})

// Testing login service
describe("Testing login service", ()=> {

    test("Return a Json Object", async()=> {
        await   api
                .get('/authentication/login/bflorentin0/1234567')
                .expect('Content-type', /application\/json/)
    })

    test('User valid access', async()=> {

        const res = await api.get('/authentication/login/bflorentin0/1234567')

        expect(res.body._status).toBe(200)
        expect(res.body._data).toHaveProperty("token")
        expect(res.body._data).toHaveProperty("name")
        expect(res.body._data).toHaveProperty("lastName")
        expect(res.body._data).toHaveProperty("userName")
        expect(res.body._data).toHaveProperty("email")
    })

    test("User invalid access with invalid userName or Password", async()=> {
        await api
              .get('/authentication/login/bflorentin0/123456')
              .expect(404)
    })
})

// Testing Get users matching with a search string
describe("Testing users search", ()=> {
    
    test('Returns a JSON Object', async ()=>{
        await api
            .get('/searchUsers/b')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are users matching with the string', async()=> {
        const response = await api.get('/searchUsers/b')
        expect(response.body._data).toHaveLength(initialUsers.length + 1)
    })
    
    test('There are not users matching with the string', async()=> {
        const response = await api.get('/searchUsers/bxx')
        expect(response.body._data).toHaveLength(0)
    })
    
    test('There is only one user matching with the string', async()=> {
        const response = await api.get('/searchUsers/bflorentino')
        expect(response.body._data).toHaveLength(1)
    })
    
    test('User matching is bflorentino', async()=> {
        const response = await api.get('/searchUsers/bflorentino')
        expect(response.body._data[0].user_name).toBe('bflorentino')
    })
})

afterAll(()=> {
    httpServer.close()
})