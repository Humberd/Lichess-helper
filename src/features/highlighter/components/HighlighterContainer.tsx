import styles from "./HighlighterContainer.module.scss";
import React from 'react';
import { State } from '../highlight-controller';

interface HighlighterContainerProps {
  state: State;
  squareSize: number;
}

export const HighlighterContainer: React.FC<HighlighterContainerProps> = props => {
  return <div>dupa</div>;
}
