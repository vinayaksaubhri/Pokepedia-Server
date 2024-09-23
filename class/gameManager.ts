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

  public createGameRoom(playerId: string, ws: WebSocket): void {
    const game = new Game({ playerId, ws });
    this.games.push(game);
    this.gameHandler(ws);

    ws.send(
      JSON.stringify({
        roomId: game.roomId,
        status: "Room Created",
        statusCode: 200,
      })
    );
  }
  public joinGameRoom(playerId: string, ws: WebSocket, roomId: string): void {
    const game = this.games.find((game) => game.roomId === roomId);
    if (game) {
      game.user2 = {
        playerId: playerId,
        webSocket: ws,
        pokemon: [],
      };
      console.log("Room Joined");
      this.gameHandler(ws);
      ws.send(
        JSON.stringify({
          roomId: game.roomId,
          status: "Room Joined",
          statusCode: 200,
        })
      );
    } else {
      console.log("not joined room");
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
      const game = this.games.find(
        (game) =>
          game.user1.webSocket === playerSocket ||
          game.user2?.webSocket === playerSocket
      );

      if (!game) {
        playerSocket.send(
          JSON.stringify({
            status: "Game Not Found",
            statusCode: 404,
          })
        );
        return;
      }
      game.handleGameEvents({
        message: JSON.parse(event.data.toString()),
        ws: playerSocket,
      });
    });
  }
}
