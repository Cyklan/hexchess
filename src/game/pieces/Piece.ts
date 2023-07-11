import { Sprite } from "pixi.js";
import { PieceColor, getPieceSprite } from "./PieceColor";
import { Coordinate } from "../board/Coordinate";
import { PieceMovementPattern } from "./PieceMovementPattern";

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
  coordinate: Coordinate;
  hasMoved = false;
  canBeCapturedEnPassant = false;

  constructor(type: PieceType, color: PieceColor, coordinate: Coordinate) {
    this.type = type;
    this.color = color;
    this.sprite = Sprite.from(getPieceSprite(type, color), {
      resolution: 2,
      resourceOptions: {
        scale: 2,
      },
    });
    this.coordinate = coordinate;
  }

  getMovementPattern(): PieceMovementPattern[] {
    switch (this.type) {
      case PieceType.King:
        return [
          ...this.getRookMovementPattern(),
          ...this.getBishopMovementPattern(),
        ].map((pattern) => ({
          ...pattern,
          infinite: false,
        }));

      case PieceType.Queen:
        return [
          ...this.getRookMovementPattern(),
          ...this.getBishopMovementPattern(),
        ];
      case PieceType.Rook:
        return this.getRookMovementPattern();
      case PieceType.Knight:
        return this.getKnightMovementPattern();
      case PieceType.Bishop:
        return this.getBishopMovementPattern();
      case PieceType.Pawn:
        return this.getPawnMovementPattern();
      default:
        return [];
    }
  }

  private getPawnMovementPattern(): PieceMovementPattern[] {
    const patterns: PieceMovementPattern[] = [];

    const forwardPattern: PieceMovementPattern = {
      q: 0,
      r: -1,
      infinite: false,
      onlyForCapture: false,
      firstPawnMove: true,
    };

    const forwardLeftPattern: PieceMovementPattern = {
      q: -1,
      r: 0,
      infinite: false,
      onlyForCapture: true,
    };

    const forwardRightPattern: PieceMovementPattern = {
      q: 1,
      r: -1,
      infinite: false,
      onlyForCapture: true,
    };

    patterns.push(forwardPattern);
    patterns.push(forwardLeftPattern);
    patterns.push(forwardRightPattern);

    return patterns;
  }

  private getBishopMovementPattern(): PieceMovementPattern[] {
    const patterns: PieceMovementPattern[] = [];
    const forwardLeftPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: -1,
      r: -1,
    };

    const forwardRightPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: 1,
      r: -2,
    };

    const leftPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: -2,
      r: 1,
    };

    const rightPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: 2,
      r: -1,
    };

    const backwardLeftPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: -1,
      r: 2,
    };

    const backwardRightPattern: PieceMovementPattern = {
      infinite: true,
      onlyForCapture: false,
      q: 1,
      r: 1,
    };

    patterns.push(forwardLeftPattern);
    patterns.push(forwardRightPattern);
    patterns.push(leftPattern);
    patterns.push(rightPattern);
    patterns.push(backwardLeftPattern);
    patterns.push(backwardRightPattern);

    return patterns;
  }

  private getKnightMovementPattern(): PieceMovementPattern[] {
    const patterns: PieceMovementPattern[] = [];
    const forwardLeftPattern: PieceMovementPattern = {
      infinite: false,
      onlyForCapture: false,
      q: -1,
      r: -2,
    };
    const forwardRightPattern: PieceMovementPattern = {
      infinite: false,
      onlyForCapture: false,
      q: 1,
      r: -3,
    };

    const backwardsLeftPattern: PieceMovementPattern = {
      q: -1,
      r: 3,
      infinite: false,
      onlyForCapture: false,
    };

    const backwardsRightPattern: PieceMovementPattern = {
      q: 1,
      r: 2,
      infinite: false,
      onlyForCapture: false,
    };

    const topLeftLeftPattern: PieceMovementPattern = {
      q: -3,
      r: 1,
      infinite: false,
      onlyForCapture: false,
    };

    const topLeftRightPattern: PieceMovementPattern = {
      q: -2,
      r: -1,
      infinite: false,
      onlyForCapture: false,
    };

    const topRightLeftPattern: PieceMovementPattern = {
      q: 2,
      r: -3,
      infinite: false,
      onlyForCapture: false,
    };

    const topRightRightPattern: PieceMovementPattern = {
      q: 3,
      r: -2,
      infinite: false,
      onlyForCapture: false,
    };

    const bottomLeftLeftPattern: PieceMovementPattern = {
      q: -3,
      r: 2,
      infinite: false,
      onlyForCapture: false,
    };

    const bottomLeftRightPattern: PieceMovementPattern = {
      q: -2,
      r: 3,
      infinite: false,
      onlyForCapture: false,
    };

    const bottomRightLeftPattern: PieceMovementPattern = {
      q: 3,
      r: -1,
      infinite: false,
      onlyForCapture: false,
    };

    const bottomRightRightPattern: PieceMovementPattern = {
      q: 2,
      r: 1,
      infinite: false,
      onlyForCapture: false,
    };

    patterns.push(forwardLeftPattern);
    patterns.push(forwardRightPattern);
    patterns.push(backwardsLeftPattern);
    patterns.push(backwardsRightPattern);
    patterns.push(topLeftLeftPattern);
    patterns.push(topLeftRightPattern);
    patterns.push(topRightLeftPattern);
    patterns.push(topRightRightPattern);
    patterns.push(bottomLeftLeftPattern);
    patterns.push(bottomLeftRightPattern);
    patterns.push(bottomRightLeftPattern);
    patterns.push(bottomRightRightPattern);

    return patterns;
  }

  private getRookMovementPattern(): PieceMovementPattern[] {
    const patterns: PieceMovementPattern[] = [];

    const forwardPattern: PieceMovementPattern = {
      q: 0,
      r: -1,
      infinite: true,
      onlyForCapture: false,
    };

    const backwardPattern: PieceMovementPattern = {
      q: 0,
      r: 1,
      infinite: true,
      onlyForCapture: false,
    };

    const topLeftPattern = {
      q: -1,
      r: 0,
      infinite: true,
      onlyForCapture: false,
    };

    const topRightPattern = {
      q: 1,
      r: -1,
      infinite: true,
      onlyForCapture: false,
    };

    const bottomLeftPattern = {
      q: -1,
      r: 1,
      infinite: true,
      onlyForCapture: false,
    };

    const bottomRightPattern = {
      q: 1,
      r: 0,
      infinite: true,
      onlyForCapture: false,
    };

    patterns.push(forwardPattern);
    patterns.push(backwardPattern);
    patterns.push(topLeftPattern);
    patterns.push(topRightPattern);
    patterns.push(bottomLeftPattern);
    patterns.push(bottomRightPattern);

    return patterns;
  }
}
