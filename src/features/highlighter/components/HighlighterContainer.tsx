import styles from "./HighlighterContainer.module.scss";
import React from "react";
import { State } from "../highlight-controller";
import { PotentialCaptureMark } from "./PotentialCaptureMark";
import { Orientation } from "../types";
import { groupBy } from "../../../utils/collections";
import { PotentialCapturePaths } from "./PotentialCapturePaths";

interface HighlighterContainerProps {
  state: State;
  squareSize: number;
  orientation: Orientation;
}

export const HighlighterContainer: React.FC<HighlighterContainerProps> = (
  props
) => {
  const boardSize = props.squareSize * 8;
  const whiteCaptures = groupBy(props.state.whiteCaptures, (move) => move.to);
  const blackCaptures = groupBy(props.state.blackCaptures, (move) => move.to);
  const allCaptureMoves = [
    ...props.state.blackCaptures,
    ...props.state.whiteCaptures,
  ];
  return (
    <section
      style={{
        width: boardSize,
        height: boardSize,
      }}
      className={styles.board}
    >
      <PotentialCapturePaths
        moves={allCaptureMoves}
        orientation={props.orientation}
      />
      {Object.entries(whiteCaptures).map(([to, moves]) => (
        <PotentialCaptureMark
          to={to as any}
          moves={moves}
          squareSize={props.squareSize}
          orientation={props.orientation}
        />
      ))}
      {Object.entries(blackCaptures).map(([to, moves]) => (
        <PotentialCaptureMark
          to={to as any}
          moves={moves}
          squareSize={props.squareSize}
          orientation={props.orientation}
        />
      ))}
    </section>
  );
};
