import UsersService from "../services/Users/UsersServices";
import UsersController from "../controllers/UsersController";
import PasswordUtilities from "../tools/PasswordUtilities";
import TokenUtilities from "../tools/TokenUtilities";
import ChatServices from "../services/Chats/ChatServices";
import ChatController from "../controllers/ChatController";

// Classes creation to implement dependency injection

// Tools Classes
const passwordUtility = new PasswordUtilities()
const tokenUtility = new TokenUtilities()

// Web Services classess
export const userServices = new UsersService(passwordUtility, tokenUtility)
export const chatServices = new ChatServices()

// Controllers Classes
const usersController = new UsersController(userServices)
const chatsController = new ChatController(chatServices)

// To Export
const controllers =  {usersController, chatsController}
export default controllers