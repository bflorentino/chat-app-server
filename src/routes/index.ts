import Express  from "express";
import controllers from "../types/classes";

const route = Express.Router()

// AUTHENTICATION ENDPOINTS
route.post('/authentication/register', controllers.usersController.postNewUser)
route.get('/authentication/login', controllers.usersController.login)

export default route