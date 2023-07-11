import { Application } from "pixi.js";
import { Coordinate } from "./Coordinate";
import { Field } from "./Field";

export const BOARD_SIZE = 5;
export const BOARD_FILE_SIZE = BOARD_SIZE * 2 + 1;

// https://www.redblobgames.com/grids/hexagons/
export class Board {
  app: Application;
  fields: Map<Coordinate, Field> = new Map();
  constructor(app: Application) {
    this.app = app;
    this.generateBoard();
  }

  generateBoard() {
    for (let q = -BOARD_SIZE; q <= BOARD_SIZE; q++) {
      const r1 = Math.max(-BOARD_SIZE, -q - BOARD_SIZE);
      const r2 = Math.min(BOARD_SIZE, -q + BOARD_SIZE);
      for (let r = r1; r <= r2; r++) {
        const field = new Field({ q, r }, this.app, q + BOARD_SIZE, r + r1);
        this.fields.set(field.coordinate, field);
      }
    }
  }
}
