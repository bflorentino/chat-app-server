export const enum HttpStatus {OK = 200, 
                              CREATED = 201,
                              NO_CONTENT = 204,
                              BAD_REQUEST = 400,
                              FORBIDEN = 403,
                              NOT_FOUND = 404,
                              SERVER_ERROR = 500
                            }

export const enum SocketEvents { connect= "connect",
                                userConnected = "user-connected",
                                disconnect = "disconnect",
                                sendMessage = "sendMessage",
                                messageReceived = "messageReceived",
                                updateMessage = "updateMessage",
                                messagedUpdated = "messageUpdated",
                                deleteMessage = "deleteMessage",
                                messageDeleted = "messageDeleted",
                                readMessage = "readMessage",
                                messageRead = "messageRead"
}