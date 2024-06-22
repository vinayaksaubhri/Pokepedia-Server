import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import authRoute from "./routes/auth.js";
dotenv.config();

//For env File

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Pokepedia Server!");
});
app.get("/healthz", (req, res) => {
  res.status(200).send("Ok");
});

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
