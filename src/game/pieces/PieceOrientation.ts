import { Coordinate } from "../board/Coordinate";
import { PieceType } from "./Piece";

export const MyPiecesStartPosition: {
  coordinate: Coordinate;
  piece: PieceType;
}[] = [
  {
    coordinate: { q: -4, r: 5 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -3, r: 5 },
    piece: PieceType.Rook,
  },
  {
    coordinate: { q: -3, r: 4 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -2, r: 5 },
    piece: PieceType.Knight,
  },
  {
    coordinate: { q: -2, r: 3 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -1, r: 5 },
    piece: PieceType.Queen,
  },
  {
    coordinate: { q: -1, r: 2 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 0, r: 5 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: 4 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: 3 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: 1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 1, r: 4 },
    piece: PieceType.King,
  },
  {
    coordinate: { q: 1, r: 1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 2, r: 3 },
    piece: PieceType.Knight,
  },
  {
    coordinate: { q: 2, r: 1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 3, r: 2 },
    piece: PieceType.Rook,
  },
  {
    coordinate: { q: 3, r: 1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 4, r: 1 },
    piece: PieceType.Pawn,
  },
];

export const OpponentPiecesStartPosition: {
  coordinate: Coordinate;
  piece: PieceType;
}[] = [
  {
    coordinate: { q: -4, r: -1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -3, r: -2 },
    piece: PieceType.Rook,
  },
  {
    coordinate: { q: -3, r: -1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -2, r: -3 },
    piece: PieceType.Knight,
  },
  {
    coordinate: { q: -2, r: -1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: -1, r: -4 },
    piece: PieceType.Queen,
  },
  {
    coordinate: { q: -1, r: -1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 0, r: -5 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: -4 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: -3 },
    piece: PieceType.Bishop,
  },
  {
    coordinate: { q: 0, r: -1 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 1, r: -5 },
    piece: PieceType.King,
  },
  {
    coordinate: { q: 1, r: -2 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 2, r: -5 },
    piece: PieceType.Knight,
  },
  {
    coordinate: { q: 2, r: -3 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 3, r: -5 },
    piece: PieceType.Rook,
  },
  {
    coordinate: { q: 3, r: -4 },
    piece: PieceType.Pawn,
  },
  {
    coordinate: { q: 4, r: -5 },
    piece: PieceType.Pawn,
  },
];
