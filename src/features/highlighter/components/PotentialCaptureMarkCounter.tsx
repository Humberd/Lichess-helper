import React from "react";
// @ts-ignore
import styles from "./PotentialCaptureMarkCounter.module.scss";
import classNames from 'classnames';

interface PotentialCaptureMarkCounterProps {
  count: number;
  isOurCapture: boolean;
}

export const PotentialCaptureMarkCounter: React.FC<
  PotentialCaptureMarkCounterProps
> = (props) => {
  return (
    <div className={classNames(styles.container, {
      [styles.ourCapture]: props.isOurCapture,
      [styles.theirCapture]: !props.isOurCapture,
    })}>
      <span className={styles.text}>{props.count}</span>
    </div>
  );
};
