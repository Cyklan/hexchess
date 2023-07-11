import { Application } from "pixi.js";
import { Field } from "./Field";
import { PieceColor } from "../pieces/PieceColor";
import {
  MyPiecesStartPosition,
  OpponentPiecesStartPosition,
} from "../pieces/PieceOrientation";
import { Piece } from "../pieces/Piece";

export const BOARD_SIZE = 5;
export const BOARD_FILE_SIZE = BOARD_SIZE * 2 + 1;

// https://www.redblobgames.com/grids/hexagons/
export class Board {
  app: Application;
  fields: Map<string, Field> = new Map();
  myColor: PieceColor = "white";

  constructor(app: Application) {
    this.app = app;
    this.generateBoard();
    this.placePieces();
  }

  generateBoard() {
    for (let q = -BOARD_SIZE; q <= BOARD_SIZE; q++) {
      const r1 = Math.max(-BOARD_SIZE, -q - BOARD_SIZE);
      const r2 = Math.min(BOARD_SIZE, -q + BOARD_SIZE);
      let fieldsDrawn = 0;
      for (let r = r1; r <= r2; r++) {
        const field = new Field(
          { q, r },
          this.app,
          q + BOARD_SIZE,
          fieldsDrawn
        );
        fieldsDrawn++;
        this.fields.set(JSON.stringify(field.coordinate), field);
      }
    }
  }

  placePieces() {
    for (const { piece, coordinate } of MyPiecesStartPosition) {
      const field = this.fields.get(JSON.stringify(coordinate));
      if (!field) {
        continue;
      }

      field.piece = new Piece(piece, this.myColor);
    }

    for (const { piece, coordinate } of OpponentPiecesStartPosition) {
      const field = this.fields.get(JSON.stringify(coordinate));
      if (!field) {
        continue;
      }

      field.piece = new Piece(
        piece,
        this.myColor === "white" ? "black" : "white"
      );
    }
  }
}
