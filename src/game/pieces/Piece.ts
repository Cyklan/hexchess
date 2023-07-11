import { Sprite } from "pixi.js";
import { PieceColor, getPieceSprite } from "./PieceColor";

export enum PieceType {
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King,
}

export class Piece {
  type: PieceType;
  color: PieceColor;
  sprite: Sprite;

  constructor(type: PieceType, color: PieceColor) {
    this.type = type;
    this.color = color;
    this.sprite = Sprite.from(getPieceSprite(type, color));
  }
}
