import WebSocket from "ws";
import { GAME_EVENTS } from "../types/gameEvents";

export type user = {
  playerId: string;
  webSocket: WebSocket;
  pokemon: pokemon[];
};

export type pokemon = {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  name: string;
  type: PokemonTypes;
  health: number;
  moves: string[];
  isBoolean: boolean;
  ailment: ailment;
};
export type GameMessage =
  | {
      type: GAME_EVENTS.ADD_POKEMON_TO_GAME;
      pokemon: pokemon;
    }
  | {
      type: GAME_EVENTS.GAME_MOVE;
      move: string;
    }
  | {
      type: GAME_EVENTS.CREATE_NEW_GAME;
      playerId: string;
    };
export type move = {
  name: string;
  type: PokemonTypes;
  ailment: string;
  ailmentChance: number;
  accuracy: number;
  power: number;
};
export type ailment =
  | "paralysis"
  | "sleep"
  | "freeze"
  | "burn"
  | "poison"
  | "confusion"
  | "trap";

export type PokemonTypes =
  | "Bug"
  | "Dark"
  | "Electric"
  | "Dragon"
  | "Fire"
  | "Grass"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Flying"
  | "Ghost"
  | "Rock"
  | "Ice"
  | "Normal"
  | "Poison"
  | "Psychic"
  | "Ground"
  | "Steel"
  | "Water";
