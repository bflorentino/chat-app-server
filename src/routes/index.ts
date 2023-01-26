import Express  from "express";
import controllers from "../types/classes";

const route = Express.Router()

// AUTHENTICATION ENDPOINTS
route.post('/authentication/register', controllers.usersController.postNewUser)
route.get('/authentication/login/:user/:psw',controllers.usersController.login)

// Search Users
route.get('/searchUsers/:searchString',controllers.usersController.matchedUsers)

// Time connection
route.get('/lastTime/:userName',controllers.usersController.getUserLastTime)

// CHATS ROUTES
route.get('/chat/:userName', controllers.usersController.getUserData)
route.get('/chats/:userName',(req, res) => controllers.chatsController.getChats(req, res))

export default route