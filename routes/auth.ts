import express, { Request, Response } from "express";
import { userData,tokenData } from "./db.js";
import { sendEmail } from "../utils.js";
import { EMAIL_TOKEN_EXPIRATION_MINUTES, AUTHENTICATION_EXPIRATION_HOURS, generateEmailToken } from "../utils.js";

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = userData?.map((userInfo) => {
        if (userInfo.email === email) {
            return userInfo;
        }
    }).filter(user => user !== undefined)[0];
console.log('mail ',email)
    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    if (!user){
        userData.push({
            userId:4,
            username : "Vinni1",
            email : email,
            tokenData : {
             token : emailToken,
             expiration : expiration
            }
        })

        tokenData.push({
            id:234,
            userId: 4,
            token:"111111",
            expiration : false,
            createdAt : new Date()
        })
    }

    res.status(200).json(user)

    sendEmail();

});


router.post('/authenticate', async (req, res) => {
    const { email, token } = req.body;

    const dbToken = userData?.map((item) => {
        if (item.tokenData.token === token) {
            return item.tokenData;
        }
    }).filter(token => token !== undefined)[0];

    console.log('token ', dbToken)
    
    if (!dbToken) {
        return res.sendStatus(401).json("Invalid token");
    }

    if (dbToken.expiration < new Date()) {
        return res.status(401).json({ error: 'Token expired!' });
    }


    const expiration = new Date(
        new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
    );

    res.json({ dbToken })

    // apitoken for user session


    // jwt_token


})
export default router;

