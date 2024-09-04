import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import { rateLimit } from "express-rate-limit";
import { WebSocketServer } from "ws";
import { GameManager } from "./class/gameManager.js";
import { GAME_EVENTS } from "./types/gameEvents.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

dotenv.config();

//For env File

const app: Application = express();
const port = process.env.PORT || 8000;
const wss = new WebSocketServer({ port: 8080 });

app.use(express.json());
app.use(limiter);

wss.on("connection", function connection(ws) {
  try {
    const GameInstance = GameManager.getInstance();
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === GAME_EVENTS.CREATE_NEW_GAME) {
        GameInstance.createGameRoom(message.playerId, ws);
      } else if (message.type === GAME_EVENTS.JOIN_GAME) {
        GameInstance.joinGameRoom(message.playerId, ws, message.roomId);
      }
    });
  } catch (error) {
    console.log("🚀 ~ connection ~ error:", error);
  }
});

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
