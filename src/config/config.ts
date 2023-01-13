import Dotenv from 'dotenv'

if(process.env.NODE_ENV !== "production"){
    Dotenv.config()
}

const envVariables = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    connectionString: process.env.CONNECTION_STRING_DEV,
    connectionStringTest: process.env.CONNECTION_STRING_TEST,
    secretToken: process.env.SECRET_TOKEN,
    
}

export default envVariables