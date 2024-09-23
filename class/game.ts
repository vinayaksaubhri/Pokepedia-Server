import { GAME_EVENTS } from "../types/gameEvents.js";
import generateRoomId from "../utils/generateRoomId.js";
import WebSocket from "ws";
import { GameMessage, pokemon, user } from "./types.js";
import { validatePokemon } from "./utils.js";
export class Game {
  public roomId: string;
  public user1: user;
  public user2?: user;
  private numberOfMoves: number = 0;

  constructor({ playerId, ws }: { playerId: string; ws: WebSocket }) {
    this.roomId = generateRoomId();
    this.user1 = {
      playerId: playerId,
      webSocket: ws,
      pokemon: [],
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
      this.user2?.webSocket === ws ? this.user2.playerId : this.user1.playerId;

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
    if (!validatedPokemon) {
      ws.send(
        JSON.stringify({
          status: "Invalid Pokemon",
          statusCode: 400,
        })
      );
      return;
    }
    if (playerId === this.user1.playerId) {
      this.user1.pokemon.push(validatedPokemon);
    } else {
      this.user2?.pokemon.push(validatedPokemon);
    }
    ws.send(
      JSON.stringify({
        status: "Pokemon Added",
        statusCode: 200,
      })
    );
  }
  private handleGameMove({ move, ws }: { move: string; ws: WebSocket }) {
    console.log("handle game move", move, ws);
    this.numberOfMoves++;
    ws.send(
      JSON.stringify({
        status: "Move Made",
        statusCode: 200,
      })
    );
  }
}
