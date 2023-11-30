import React from "react";
import styles from "./PotentialCaptureMark.module.scss";
import { getSquareCoordinates } from "../chess-utils";
import { Move } from "chess.js";

interface PotentialCaptureMarkProps {
  move: Move;
  squareSize: number;
  orientation: "white" | "black";
}

export const PotentialCaptureMark: React.FC<PotentialCaptureMarkProps> = (
  props
) => {
  const coordinates = getSquareCoordinates(
    props.move.to,
    props.squareSize,
    props.orientation
  );
  const transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;
  console.log(props.move);
  return (
    <div
      data-square={props.move.to}
      style={{
        transform,
        width: props.squareSize,
        height: props.squareSize,
      }}
      className={styles.potentialCaptureMark}
    >
      {props.move.to}
    </div>
  );
};
