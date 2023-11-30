import React from "react";
import { Move } from "chess.js";
import { getSquareCoordinates } from "../chess-utils";
import { Orientation } from "../types";

interface PotentialCapturePathProps {
  move: Move;
  orientation: Orientation;
}

export const PotentialCapturePath: React.FC<PotentialCapturePathProps> = (
  props
) => {
  // we want only a coordinate, not a pixel position on the screen
  const squareSize = 1;
  const offset = 0.5;
  const fromCoordinates = getSquareCoordinates(
    props.move.from,
    squareSize,
    props.orientation
  );
  const fromX = fromCoordinates.x + offset;
  const fromY = fromCoordinates.y + offset;
  const toCoordinates = getSquareCoordinates(
    props.move.to,
    squareSize,
    props.orientation
  );
  const toX = toCoordinates.x + offset;
  const toY = toCoordinates.y + offset;

  // shorten the line by 1/3 of the square size
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const shortenBy = squareSize / 3;
  const newLength = length - shortenBy;
  const ratio = newLength / length;
  const xDiff = dx * ratio;
  const yDiff = dy * ratio;
  const newX = fromX + xDiff;
  const newY = fromY + yDiff;


  return (
    <g>
      <line
        stroke="#15781B"
        strokeWidth="0.15625"
        strokeLinecap="round"
        markerEnd="url(#script-arrowhead)"
        opacity="0.5"
        x1={fromX}
        y1={fromY}
        x2={newX}
        y2={newY}
      ></line>
    </g>
  );
};
