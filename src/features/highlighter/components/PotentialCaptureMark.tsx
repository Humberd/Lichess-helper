import React from "react";
import styles from "./PotentialCaptureMark.module.scss";
import { getSquareCoordinates } from "../chess-utils";
import { Move, Square } from "chess.js";

import { Orientation } from "../types";
import classNames from "classnames";
import { PotentialCaptureMarkCounter } from "./PotentialCaptureMarkCounter";

interface PotentialCaptureMarkProps {
  to: Square;
  moves: Move[];
  squareSize: number;
  orientation: Orientation;
}

export const PotentialCaptureMark: React.FC<PotentialCaptureMarkProps> = (
  props
) => {
  const coordinates = getSquareCoordinates(
    props.to,
    props.squareSize,
    props.orientation
  );
  const transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;
  const ourCapture =
    props.orientation === "white"
      ? props.moves[0].color === "w"
      : props.moves[0].color === "b";
  const theirCapture =
    props.orientation === "white"
      ? props.moves[0].color === "b"
      : props.moves[0].color === "w";
  return (
    <div
      data-square={props.to}
      style={{
        transform,
        width: props.squareSize,
        height: props.squareSize,
      }}
      className={classNames(styles.potentialCaptureMark, {
        [styles.ourCapture]: ourCapture,
        [styles.theirCapture]: theirCapture,
      })}
    >
      <div className={styles.circle} />
      {props.moves.length > 1 && (
        <PotentialCaptureMarkCounter
          count={props.moves.length}
          isOurCapture={ourCapture}
        />
      )}
    </div>
  );
};
