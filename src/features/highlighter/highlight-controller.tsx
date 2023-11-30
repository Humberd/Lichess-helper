import { log } from "../../utils/utils";
import { Chess, Move } from "chess.js";
import { getChessLegalMovesFor } from "./chess-utils";
import { createRoot, Root } from "react-dom/client";
import { HighlighterContainer } from "./components/HighlighterContainer";
import { Orientation } from "./types";

export interface State {
  whiteLegalMoves: Move[];
  blackLegalMoves: Move[];
  whiteCaptures: Move[];
  blackCaptures: Move[];
}

export class HighlightController {
  private state?: State;
  private squareSize?: number;
  private orientation?: Orientation;
  private root?: Root;

  static create(rootElement: HTMLElement | null) {
    if (!rootElement) {
      throw Error("rootElement is undefined");
    }
    return new HighlightController(rootElement);
  }

  private constructor(private rootElement: HTMLElement) {}

  recalculateLegalMoves(allMovesSinceStart: string[]) {
    log("recalculateLegalMoves for board state", allMovesSinceStart);
    const chess = new Chess();
    allMovesSinceStart.forEach((move) => {
      chess.move(move);
    });
    const whiteLegalMoves = getChessLegalMovesFor(chess.fen(), "w");
    const blackLegalMoves = getChessLegalMovesFor(chess.fen(), "b");
    this.state = {
      whiteLegalMoves,
      blackLegalMoves,
      whiteCaptures: whiteLegalMoves.filter((move) => move.flags.includes("c")),
      blackCaptures: blackLegalMoves.filter((move) => move.flags.includes("c")),
    };
  }

  setSquareSize(squareSize: number) {
    this.squareSize = squareSize;
  }

  setOrientation(orientation: Orientation) {
    this.orientation = orientation;
  }

  tryRepaint() {
    if (!this.state || !this.squareSize || !this.orientation) {
      return;
    }
    this.tryCreateReactComponent();

    this.repaint();
  }

  private tryCreateReactComponent() {
    log("tryCreateReactComponent");
    if (!this.root) {
      const reactContainer = document.createElement("div");
      reactContainer.id = "DUPAA";
      this.rootElement.appendChild(reactContainer);
      this.root = createRoot(reactContainer);
    }

    this.root.render(
      <HighlighterContainer
        state={this.state!}
        squareSize={this.squareSize!}
        orientation={this.orientation!}
      />
    );
  }

  private repaint() {}
}
