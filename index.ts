import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { login } from './routes/auth';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});
app.get('/healthz', (req, res) => {
  res.status(200).send('Ok');
});

app.use('/login', login);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
