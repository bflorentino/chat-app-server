import { application } from "../../index"
import supertest from "supertest"

export const api = supertest(application)

export const initialUsers = [
    {
        user_name:"bflorentino",
        name:"Jose",
        last_name:"Rodriguez",
        email:"jose@hotmail.com",
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        _id:"jose@hotmail.com"
    },
    {
        user_name:"bryan",
        name:"Jose",
        last_name:"Manuel",
        email:"josem@hotmail.com",
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        _id:"josem@hotmail.com"
    },
    {
        user_name:"bienvenido",
        name:"Bienvenido",
        last_name:"Rodriguez",
        email:"bienvenido@hotmail.com",
        password:"$2a$10$B3Cxvo5855MW92WlqAxhd.I.rKMOrDvEHNyVHBJZO/4AZMPmBp/EG",
        _id:"bienvenido@hotmail.com"
    }   
]