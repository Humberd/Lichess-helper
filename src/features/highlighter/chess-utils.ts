import { Chess, Square } from 'chess.js';
import { Orientation } from './types';

export function getChessLegalMovesFor(fen: string, color: "w" | "b") {
  const swappedFen = setColor(fen, color);
  const chess = new Chess(swappedFen);
  return chess.moves({ verbose: true });
}

function setColor(fen: string, color: "w" | "b") {
  const parts = fen.split(" ");
  parts[1] = color;
  return parts.join(" ");
}

export function getSquareCoordinates(
  square: Square,
  squareSize: number,
  orientation: Orientation
) {
  const parts = square.split("");
  const file = parts[0];
  const rank = parts[1];
  return {
    x: getX(file, squareSize, orientation),
    y: getY(rank, squareSize, orientation),
  };
}

function getX(
  file: string,
  squareSize: number,
  orientation: "white" | "black"
) {
  const fileIndex = "abcdefgh".indexOf(file);
  return orientation === "white"
    ? fileIndex * squareSize
    : (7 - fileIndex) * squareSize;
}

function getY(
  rank: string,
  squareSize: number,
  orientation: "white" | "black"
) {
  const rankIndex = "12345678".indexOf(rank);
  return orientation === "white"
    ? (7 - rankIndex) * squareSize
    : rankIndex * squareSize;
}
