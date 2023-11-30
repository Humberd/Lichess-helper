import styles from "./HighlighterContainer.module.scss";
import React from "react";
import { State } from "../highlight-controller";
import { PotentialCaptureMark } from "./PotentialCaptureMark";
import { Orientation } from "../types";

interface HighlighterContainerProps {
  state: State;
  squareSize: number;
  orientation: Orientation;
}

export const HighlighterContainer: React.FC<HighlighterContainerProps> = (
  props
) => {
  const boardSize = props.squareSize * 8;
  return (
    <section
      style={{
        width: boardSize,
        height: boardSize,
      }}
      className={styles.board}
    >
      {props.state.whiteCaptures.map((move) => (
        <PotentialCaptureMark
          move={move}
          squareSize={props.squareSize}
          orientation={props.orientation}
        />
      ))}
      {props.state.blackCaptures.map((move) => (
        <PotentialCaptureMark
          move={move}
          squareSize={props.squareSize}
          orientation={props.orientation}
        />
      ))}
    </section>
  );
};
