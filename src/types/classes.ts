import UsersService from "../services/Users/UsersServices";
import UsersController from "../controllers/UsersController";
import PasswordUtilities from "../tools/PasswordUtilities";
import TokenUtilities from "../tools/TokenUtilities";

// Classes creation to implement dependency injection

// Tools Classes
const passwordUtility = new PasswordUtilities()
const tokenUtility = new TokenUtilities()

// Web Services classess
const userServices = new UsersService(passwordUtility, tokenUtility)

// Controllers Classes
const usersController = new UsersController(userServices)

// To Export
const controllers =  {usersController}
export default controllers