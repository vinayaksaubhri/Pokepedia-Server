import express,{Request,Response} from "express";
import { data } from "./db";

const router = express.Router()


export const login = async (req :  Request,res : Response) =>{
    const {username,password} = req.body;
    const user = data?.map((item)=>{
                 if(item.username == username)
                    return username
    })
    console.log('username ',user,password)
    
} 

router.post('/login',login)




