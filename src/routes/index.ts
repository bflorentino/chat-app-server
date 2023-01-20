import Express  from "express";
import controllers from "../types/classes";

const route = Express.Router()

// AUTHENTICATION ENDPOINTS
route.post('/authentication/register',       (req, res) => controllers.usersController.postNewUser(req, res))
route.get('/authentication/login/:user/:psw',(req, res) => controllers.usersController.login(req, res))

// Search Users
route.get('/searchUsers/:searchString',(req, res) => controllers.usersController.matchedUsers(req, res))

// Time connection
route.get('/lastTime/:userName',(req, res) => controllers.usersController.getUserLastTime(req, res))

// CHATS ROUTES
route.get('/chats/:userName',(req, res) => controllers.chatsController.getChats(req, res))

export default route