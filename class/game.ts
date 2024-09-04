import { GAME_EVENTS } from "../types/gameEvents.js";
import generateRoomId from "../utils/generateRoomId.js";
import WebSocket from "ws";
import { GameMessage, pokemon } from "./types.js";
import { validatePokemon } from "./utils.js";

export class Game {
  public roomId: string;
  public user: {
    player1Id: string;
    webSocketPlayer1: WebSocket;
    player2Id?: string;
    webSocketPlayer2?: WebSocket;
  };
  private numberOfMoves: number = 0;
  private pokemon: {
    player1Pokemon: pokemon[];
    player2Pokemon: pokemon[];
  } = {
    player1Pokemon: [],
    player2Pokemon: [],
  };

  constructor({ player1Id, ws }: { player1Id: string; ws: WebSocket }) {
    this.roomId = generateRoomId();
    this.user = {
      player1Id: player1Id,
      webSocketPlayer1: ws,
    };
  }
  public handleGameEvents({
    message,
    ws,
  }: {
    message: GameMessage;
    ws: WebSocket;
  }) {
    console.log("🚀 ~ Game ~ handleGameEvents ~ message:", message, ws);
    const type = message?.type;
    const playerId =
      this.user.webSocketPlayer1 === ws
        ? this.user.player1Id
        : (this.user.player2Id as string);

    switch (type) {
      case GAME_EVENTS.GAME_MOVE:
        this.handleGameMove({ move: message["move"], ws });
        break;
      case GAME_EVENTS.ADD_POKEMON_TO_GAME:
        this.addPokemonToGame({ pokemon: message["pokemon"], ws, playerId });
        break;
    }
  }
  private addPokemonToGame({
    pokemon,
    ws,
    playerId,
  }: {
    pokemon: pokemon;
    ws: WebSocket;
    playerId: string;
  }) {
    console.log("add pokemon", pokemon, ws, playerId);
    const validatedPokemon = validatePokemon(pokemon);
    if (playerId === this.user.player1Id) {
      this.pokemon.player1Pokemon.push(validatedPokemon);
    } else {
      this.pokemon.player2Pokemon.push(validatedPokemon);
    }
  }
  private handleGameMove({ move, ws }: { move: string; ws: WebSocket }) {
    console.log("🚀 ~ Game ~ handleGameMove ~ move", move, ws);
  }
}
