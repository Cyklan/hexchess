import { Move } from "../messages/baseMessageSchema";
import { Player } from "./player";

export type Game = {
  id: string;
  password: string | undefined;
  players: Player[];
  history: Move[];
};
