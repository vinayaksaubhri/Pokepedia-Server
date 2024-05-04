import express, { Request, Response } from "express";
import { userData } from "./db.js";
import { EMAIL_TOKEN_EXPIRATION_MINUTES, AUTHENTICATION_EXPIRATION_HOURS, generateEmailToken } from "../utils.js";

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = userData?.map((userInfo) => {
        if (userInfo.email === email) {
            return userInfo;
        }
    }).filter(user => user !== undefined)[0];

    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    if (!user){
        userData.push({
            username : "Vinni1",
            email : email,
            tokenData : {
             token : emailToken,
             expiration : expiration
            }
        })
    }

    res.status(200).json(user)

    //send Email

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

