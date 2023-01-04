import { HttpStatus } from "../types/enums";
import { ServerRes } from "../types/interfaces";

// DEFAULT HTTP Server Responses for errors and bad requests

const defaultForBad = {success: false, data:null}

export const Server_Error:ServerRes = {
    ...defaultForBad,
    message:"Sorry. There was an error in server",
    status: HttpStatus.SERVER_ERROR,
}

export const Server_Not_Found:ServerRes = {
    ...defaultForBad,
    message: "Resources were not found in server",
    status: HttpStatus.NOT_FOUND,
}

export const Server_Bad_Request:ServerRes = {
    ...defaultForBad,
    message:"Bad Request was made",
    status: HttpStatus.BAD_REQUEST
}

export const Server_Not_Auntenticated:ServerRes = {
    ...defaultForBad,
    message:"Sorry, you are not autenticated",
    status: HttpStatus.FORBIDEN
}

const Responses = {
    Server_Error,
    Server_Bad_Request,
    Server_Not_Found,
    Server_Not_Auntenticated
}

export default Responses