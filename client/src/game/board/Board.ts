import { Application } from "pixi.js";
import { Field } from "./Field";
import { PieceColor } from "../pieces/PieceColor";
import {
  MyPiecesStartPosition,
  OpponentPiecesStartPosition,
} from "../pieces/PieceOrientation";
import { Piece, PieceType } from "../pieces/Piece";
import { PieceMovementPattern } from "../pieces/PieceMovementPattern";
import { Coordinate } from "./Coordinate";
import { History } from "../history";

export const BOARD_SIZE = 5;
export const BOARD_FILE_SIZE = BOARD_SIZE * 2 + 1;

// https://www.redblobgames.com/grids/hexagons/
export class Board {
  app: Application;
  fields: Map<string, Field> = new Map();
  myColor: PieceColor = "white";
  isItMyTurn = this.myColor === "white";
  history: History[] = [];
  isInteractive: boolean;

  constructor(app: Application, interactive = true) {
    this.app = app;
    this.isInteractive = interactive;
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
          fieldsDrawn,
          this.myColor,
          this.isInteractive,
          (patterns, origin) => this.highlightFields(patterns, origin),
          (to) => this.movePiece(to)
        );
        fieldsDrawn++;
        this.fields.set(JSON.stringify(field.coordinate), field);
      }
    }
  }

  placePieces() {
    const field = this.fields.get(JSON.stringify({ q: 0, r: 0 }));
    if (!field) {
      return;
    }

    for (const { piece, coordinate } of MyPiecesStartPosition) {
      const field = this.fields.get(JSON.stringify(coordinate));
      if (!field) {
        continue;
      }

      field.piece = new Piece(piece, this.myColor, coordinate);
    }

    for (const { piece, coordinate } of OpponentPiecesStartPosition) {
      const field = this.fields.get(JSON.stringify(coordinate));
      if (!field) {
        continue;
      }

      field.piece = new Piece(
        piece,
        this.myColor === "white" ? "black" : "white",
        coordinate
      );
    }
  }

  highlightFields(
    movementPatterns: PieceMovementPattern[],
    origin: Coordinate
  ) {
    const validFields = this.findValidFields(movementPatterns, origin);
    for (const field of validFields) {
      field.highlight();
    }

    const lastMove = this.history[this.history.length - 1];
    if (!lastMove) {
      return;
    }

    const originField = this.fields.get(JSON.stringify(lastMove.from));
    const targetField = this.fields.get(JSON.stringify(lastMove.to));

    if (!originField || !targetField) {
      return;
    }

    originField.highlightAsPreviousMove();
    targetField.highlightAsPreviousMove();
  }

  private findValidFields(
    movementPatterns: PieceMovementPattern[],
    origin: Coordinate
  ) {
    const validFields: Field[] = [];

    for (const field of this.fields.values()) {
      field.unhighlight();
    }

    const originField = this.fields.get(JSON.stringify(origin));
    if (!originField) {
      return validFields;
    }

    for (const pattern of movementPatterns) {
      const { q, r } = pattern;
      let target: Coordinate = {
        q: origin.q + q,
        r: origin.r + r,
      };
      let field = this.fields.get(JSON.stringify(target));
      while (field != null) {
        if (field.piece) {
          // test if field ahead is occupied by opponent
          // its only valid if its an opponents piece
          if (field.piece.color !== this.myColor) {
            if (originField.piece!.type !== PieceType.Pawn) {
              field.canBeCaptured = true;
              validFields.push(field);
            } else {
              // if its a pawn, its only valid if its diagonal
              if (q !== 0) {
                field.canBeCaptured = true;
                validFields.push(field);
              }
            }
          }

          break;
        }

        if (!pattern.onlyForCapture) {
          validFields.push(field);
        }

        if (
          pattern.infinite ||
          (pattern.firstPawnMove &&
            originField.piece?.type === PieceType.Pawn &&
            !originField.piece.hasMoved)
        ) {
          pattern.firstPawnMove = false;
          target = {
            q: target.q + q,
            r: target.r + r,
          };
          field = this.fields.get(JSON.stringify(target));
        } else {
          break;
        }
      }
    }

    return validFields;
  }

  public movePiece(target: Coordinate) {
    // this removes my en passant after my next move
    Array.from(this.fields.values()).forEach((field) => {
      if (field.piece?.color !== this.myColor) {
        return;
      }
      if (field.piece) {
        field.piece.canBeCapturedEnPassant = false;
      }
      field.canBeCaptured = false;
    });

    const originField = Array.from(this.fields.values()).find(
      (field) => field.isStartTile
    );
    const targetField = this.fields.get(JSON.stringify(target));

    console.log("origin", originField);
    console.log("target", targetField);

    if (!originField || !targetField) {
      return;
    }

    const move: History = {
      from: originField.coordinate,
      to: target,
      move: this.history.length + 1,
      piece: originField.piece!.type,
      capturedPiece: targetField.piece?.type,
    };

    this.history.push(move);

    // determine wether the move was by a pawn and two spaces
    // if so, set the en passant flag
    if (
      originField.piece?.type === PieceType.Pawn &&
      Math.abs(originField.coordinate.r - targetField.coordinate.r) === 2
    ) {
      originField.piece.canBeCapturedEnPassant = true;
      originField.canBeCaptured = true;
    }

    if (originField.piece) {
      if (
        originField.piece.hasMoved &&
        originField.piece.canBeCapturedEnPassant
      ) {
        originField.piece.canBeCapturedEnPassant = false;
      }
      targetField.piece = originField.piece;
      originField.piece = null;
      targetField.piece.hasMoved = true;
    }

    this.isItMyTurn = false;
    Array.from(this.fields.values()).forEach((field) => field.disable());
  }
}
