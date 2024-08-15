import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import { rateLimit } from "express-rate-limit";
import { WebSocketServer } from "ws";
import { GameManager } from "./class/gameManager.js";

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
    console.log("🚀 ~ connection ~ GameInstance:");
    const GameInstance = GameManager.getInstance();
    console.log("🚀 ~ connection ~ GameInstance:", GameInstance);
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "create") {
        GameInstance.createGameRoom(message.playerId, ws as any);
      } else if (message.type === "join") {
        GameInstance.joinGameRoom(message.playerId, ws as any, message.roomID);
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
