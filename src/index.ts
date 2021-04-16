import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

const dot = dotenv.config()
const app = express();
app.use(helmet())
app.use(cors())

import Twitch from './routes/Twitch';

const twitch = new Twitch()

/*
    ROUTES
*/

app.get('/', (req: Request, res: Response) => res.send("OwO"))
app.get('/twitch', (req: Request, res: Response) => twitch.getChannel(req, res))

app.listen(9090, () => {
    console.log("Stringy Software API up")
})