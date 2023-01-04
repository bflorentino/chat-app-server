import Dotenv from 'dotenv'

if(process.env.NODE_ENV !== "production"){
    Dotenv.config()
}

const envVariables = {
    port: process.env.PORT,
    connectionString: process.env.CONNECTION_STRING,
    secretToken: process.env.SECRET_TOKEN
}

export default envVariables