import express, { Request, Response } from "express";
import { userData } from "./db.js";

const router = express.Router()
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;

function generateEmailToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = userData?.map((item) => {
        if (item.username === username) {
            return item;
        }
    }).filter(user => user !== undefined)[0];

    if (!user)
        return res.status(404).json('User not found')

    if (user.password !== password)
        return res.status(404).json('Incorrect password')

    res.status(200).json(user)

    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    // save token to DB

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
        return res.sendStatus(401);
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

