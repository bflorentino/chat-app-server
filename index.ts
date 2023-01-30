import Express from 'express'
import http from 'http'
import cors from 'cors'
import SocketManager  from './src/socket/SocketManager'
import variables from './src/config/config'
import route from './src/routes'
import { chatServices, userServices } from './src/types/classes'
import fileUpload from 'express-fileupload'

export const application = Express()

application.use(cors())
application.use("/profilePic", Express.static("public/ProfileImg"))
application.use(fileUpload())
application.use(Express.urlencoded({extended:true}))
application.use(Express.json())
application.use("/", route)

export const httpServer = http.createServer(application)
SocketManager.createSocketInstance(httpServer, chatServices, userServices)

httpServer.listen(variables.port, ()=> {
    console.log(`Server is running in port ${variables.port}`)
})
