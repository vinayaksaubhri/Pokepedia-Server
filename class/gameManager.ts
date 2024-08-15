import { Game } from "./game.js";
import WebSocket from "ws";

export class GameManager {
  private games: Game[];
  private static instance: GameManager;
  private constructor() {
    this.games = [];
  }

  // singleton pattern
  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public createGameRoom(playerID: string, ws: WebSocket): void {
    const game = new Game({ player1Id: playerID, ws });
    this.games.push(game);
    this.gameHandler(ws);

    ws.send(
      JSON.stringify({
        roomId: game.roomID,
        status: "Room Created",
        statusCode: 200,
      })
    );
  }
  public joinGameRoom(playerID: string, ws: WebSocket, roomID: string): void {
    const game = this.games.find((game) => game.roomID === roomID);
    if (game) {
      game.user.player2Id = playerID;
      game.user.webSocketPlayer2 = ws;
      ws.send(
        JSON.stringify({
          roomId: game.roomID,
          status: "Room Joined",
          statusCode: 200,
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          status: "Room Not Found",
          statusCode: 404,
        })
      );
    }
  }
  private gameHandler(playerSocket: WebSocket): void {
    // handle game logic
    playerSocket.addEventListener("message", (event) => {
      console.log("🚀 ~ gameHandler ~ event:", event.data, this.games);
      const game = this.games.find(
        (game) =>
          game.user.webSocketPlayer1 === playerSocket ||
          game.user.webSocketPlayer2 === playerSocket
      );
      console.log(
        "🚀 ~ GameManager ~ playerSocket.addEventListener ~ game:",
        game
      );
    });
  }
}
