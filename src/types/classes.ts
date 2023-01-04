import UsersService from "../services/Users/UsersServices";
import UsersController from "../controllers/UsersController";

// Classes creation to implement dependency injection

// Web Services classess
const userServices = new UsersService()

// Controllers Classes
const usersController = new UsersController(userServices)


// To Export
const controllers =  {usersController}
export default controllers