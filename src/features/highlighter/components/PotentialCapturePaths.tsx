import React from "react";
import styles from "./PotentialCapturePaths.module.scss";
import { Move } from "chess.js";
import { PotentialCapturePath } from "./PotentialCapturePath";
import { Orientation } from "../types";

interface PotentialCapturePathsProps {
  moves: Move[];
  orientation: Orientation;
}

export const PotentialCapturePaths: React.FC<PotentialCapturePathsProps> = (
  props
) => {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 8 8"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="script-filter-blur">
          <feGaussianBlur stdDeviation="0.019"></feGaussianBlur>
        </filter>
        <marker
          id="script-arrowhead-our"
          orient="auto"
          overflow="visible"
          markerWidth="4"
          markerHeight="4"
          refX="2.05"
          refY="2"
        >
          <path d="M0,0 V4 L3,2 Z" fill="#15781B"></path>
        </marker>
        <marker
            id="script-arrowhead-their"
            orient="auto"
            overflow="visible"
            markerWidth="4"
            markerHeight="4"
            refX="2.05"
            refY="2"
        >
          <path d="M0,0 V4 L3,2 Z" fill="#8f2222"></path>
        </marker>
      </defs>
      <g>
        {props.moves.map((move) => (
          <PotentialCapturePath move={move} orientation={props.orientation} />
        ))}
      </g>
    </svg>
  );
};
