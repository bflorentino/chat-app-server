import Express  from "express";
import controllers from "../types/classes";

const route = Express.Router()

// AUTHENTICATION ENDPOINTS
route.post('/authentication/register',       (req, res) => controllers.usersController.postNewUser(req, res))
route.get('/authentication/login/:user/:psw',(req, res) => controllers.usersController.login(req, res))

export default route