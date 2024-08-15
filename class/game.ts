import generateRoomId from "../utils/generateRoomId.js";
import WebSocket from "ws";

export class Game {
  public roomID: string;
  public user: {
    player1Id: string;
    webSocketPlayer1: WebSocket;
    player2Id?: string;
    webSocketPlayer2?: WebSocket;
  };

  constructor({ player1Id, ws }: { player1Id: string; ws: WebSocket }) {
    this.roomID = generateRoomId();
    this.user = {
      player1Id: player1Id,
      webSocketPlayer1: ws,
    };
  }
}
