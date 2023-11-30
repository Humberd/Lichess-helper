import { Chess } from 'chess.js';

export function getChessLegalMovesFor(fen: string, color: 'w' | 'b') {
  const swappedFen = setColor(fen, color);
  const chess = new Chess(swappedFen);
  return chess.moves({ verbose: true });
}

function setColor(fen: string, color: 'w' | 'b') {
  const parts = fen.split(' ');
  parts[1] = color;
  return parts.join(' ');
}


export function getSquareCoordinates(square: string, squareSize: number) {
  const parts = square.split('');
  const file = parts[0];
  const rank = parts[1];
  return {
    x: getX(file, squareSize),
    y: getY(rank, squareSize),
  };
}

function getX(file: string, squareSize: number) {
  // must be relative to the size of the board
  const fileIndex = 'abcdefgh'.indexOf(file);
  return fileIndex * squareSize;
}

function getY(rank: string, squareSize: number) {
  // must be relative to the size of the board
  const rankIndex = '12345678'.indexOf(rank);
  return rankIndex * squareSize;
}

