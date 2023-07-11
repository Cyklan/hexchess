import { Coordinate } from "./board/Coordinate";
import { PieceType } from "./pieces/Piece";

export type History = {
  move: number;
  piece: PieceType;
  from: Coordinate;
  to: Coordinate;
  capturedPiece?: PieceType;
};
