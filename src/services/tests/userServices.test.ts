import supertest from 'supertest'
import connectToDb from '../../database/connection'
import { application, httpServer } from '../../index'
import UserModel from '../../models/User'

const testService = supertest(application)

const initialUsers = [
    {
        user_name:"bflorentino",
        name:"Jose",
        last_name:"Rodriguez",
        email:"jose@hotmail.com",
        password:"1234567",
        _id:"jose@hotmail.com"
    },
    {
        user_name:"bryan",
        name:"Jose",
        last_name:"Manuel",
        email:"josem@hotmail.com",
        password:"1234567",
        _id:"josem@hotmail.com"
    },
    {
        user_name:"bienvenido",
        name:"Bienvenido",
        last_name:"Rodriguez",
        email:"bienvenido@hotmail.com",
        password:"1234567",
        _id:"bienvenido@hotmail.com"
    }   
]

beforeAll(async ()=> {
    await connectToDb()
    await UserModel.deleteMany({})

    for(const user of initialUsers){
        const userToSave = new UserModel(user)
        await userToSave.save()
    }
})

// Testing Get users matching with a search string
describe("Testing users search", ()=> {
    
    test('Returns a JSON Object', async ()=>{
        await testService
            .get('/searchUsers/b')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },10000)

    test('There are users matching with the string', async()=> {
        const response = await testService.get('/searchUsers/b')
        expect(response.body._data).toHaveLength(initialUsers.length)
    }, 10000)
    
    test('There are not users matching with the string', async()=> {
        const response = await testService.get('/searchUsers/bxx')
        expect(response.body._data).toHaveLength(0)
    }, 10000)
    
    test('There is only one user matching with the string', async()=> {
        const response = await testService.get('/searchUsers/bflorentino')
        expect(response.body._data).toHaveLength(1)
    }, 10000)
    
    test('User matching is bflorentino', async()=> {
        const response = await testService.get('/searchUsers/bflorentino')
        expect(response.body._data[0].user_name).toBe('bflorentino')
    }, 10000)
})


// Testing POST new users
describe("Testint POST new users", ()=> {
    test('A valid user', async()=> {
        const user =     {
            user_name:"bflorentin0",
            name:"Florentino",
            last_name:"Rodriguez",
            email:"flore@hotmail.com",
            password:"1234567"
        }
    
        await testService
                .post('/authentication/register')
                .send(user)
                .expect(201)
                .expect('Content-type', /application\/json/)
    })
    
    test('An invalid user', async()=>{
        const user =     {
            user_name:"bflorentin23",
            name:"Florentino",
            last_name:"Rodriguez",
            email:"flore@hotmail.com",
            password:"1234567"
        }
    
            await testService
            .post('/authentication/register')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
    })    
})



// Testing login service

afterAll(()=> httpServer.close())
