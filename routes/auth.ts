import express, { Request, Response } from "express";
import { userData,tokenData } from "./db.js";
import { sendEmail } from "../utils.js";
import { EMAIL_TOKEN_EXPIRATION_MINUTES, AUTHENTICATION_EXPIRATION_HOURS, generateEmailToken } from "../utils.js";
import { v4 as uuidv4 } from "uuid"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = userData?.map((userInfo) => {
        if (userInfo.email === email) {
            return userInfo;
        }
    }).filter(user => user !== undefined)[0];
console.log('mail ',email, uuidv4())
    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    if (!user){
        const newUserID = uuidv4();
        userData.push({
            userId:newUserID,
            username : "Vinni1",
            email : email,
            tokenData : {
             token : emailToken,
             expiration : expiration
            }
        })

        tokenData.push({
            id:234,
            userId: newUserID,
            token:"111111",
            expiration : false,
            createdAt : new Date()
        })
    }

    res.status(200).json(user)

    // sendEmail(emailToken);

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

    
    // apitoken for user session nad it is used in below jwttoken
    
    
    const jwt_token = jwt.sign({ token }, process.env.JWT_SECRET || "abcd", {
        expiresIn: "12d",
	});

	res.cookie("jwt", jwt_token, {
		maxAge: 12 * 24 * 60 * 60 * 1000,
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
	});

    res.json({ jwt_token })

})
export default router;

