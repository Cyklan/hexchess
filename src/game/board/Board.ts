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
    // generate empty board
    // board is a hexagon grid
    // represented by axial coordinates

    // this.fields.set({q: 0, r: 0}, new Field({q: 0, r: 0}, this.app))

    for (let q = -BOARD_SIZE; q <= BOARD_SIZE; q++) {
      const r1 = Math.max(-BOARD_SIZE, -q - BOARD_SIZE);
      const r2 = Math.min(BOARD_SIZE, -q + BOARD_SIZE);
      for (let r = r1; r <= r2; r++) {
        const field = new Field({ q, r }, this.app);
        this.fields.set(field.coordinate, field);
      }
    }

    // console.log(this.fields);
  }
}
