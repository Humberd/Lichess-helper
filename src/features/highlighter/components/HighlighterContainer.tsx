import styles from "./HighlighterContainer.module.scss";
import React from "react";
import { State } from "../highlight-controller";
import { PotentialCaptureMark } from './PotentialCaptureMark';

interface HighlighterContainerProps {
  state: State;
  squareSize: number;
}

export const HighlighterContainer: React.FC<HighlighterContainerProps> = (
  props
) => {
  return (
    <section
      className={styles.board}
    >
      {props.state.whiteCaptures.map((move) => (
        <PotentialCaptureMark move={move} squareSize={props.squareSize} orientation={"white"}/>
      ))}
      {props.state.blackCaptures.map((move) => (
          <PotentialCaptureMark move={move} squareSize={props.squareSize} orientation={"white"}/>
      ))}
    </section>
  );
};
