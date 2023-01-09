import Express from 'express'
import http from 'http'
import cors from 'cors'
import SocketManager  from './socket/SocketManager'
import variables from './config/config'
import route from './routes'

const application = Express()
application.use(cors())
application.use(Express.urlencoded({extended:true}))
application.use(Express.json())
application.use("/", route)

const httpServer = http.createServer(application)
SocketManager.createSocketInstance(httpServer)

application.listen(variables.port, ()=> {
    console.log(`Server is running in port ${variables.port}`)
})
