import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "../../assets/pieces";
import { PieceType } from "./Piece";

export type PieceColor = "black" | "white";

export function getPieceSprite(piece: PieceType, color: PieceColor) {
  if (color === "black") {
    return getBlackPiece(piece);
  }

  return getWhitePiece(piece)
}

export function getBlackPiece(piece: PieceType) {
  switch (piece) {
    case PieceType.Pawn:
      return BlackPawn;
    case PieceType.Bishop:
      return BlackBishop;
    case PieceType.King:
      return BlackKing;
    case PieceType.Knight:
      return BlackKnight;
    case PieceType.Queen:
      return BlackQueen;
    case PieceType.Rook:
      return BlackRook;
  }
}

export function getWhitePiece(piece: PieceType) {
  switch (piece) {
    case PieceType.Pawn:
      return WhitePawn;
    case PieceType.Bishop:
      return WhiteBishop;
    case PieceType.King:
      return WhiteKing;
    case PieceType.Knight:
      return WhiteKnight;
    case PieceType.Queen:
      return WhiteQueen;
    case PieceType.Rook:
      return WhiteRook;
  }
}
