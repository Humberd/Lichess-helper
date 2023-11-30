import { log } from "../../utils/utils";
import { Chess, Move } from "chess.js";
import { getChessLegalMovesFor } from "./chess-utils";
import { createRoot } from "react-dom/client";
import { HighlighterContainer } from "./components/HighlighterContainer";

export interface State {
  whiteLegalMoves: Move[];
  blackLegalMoves: Move[];
  whiteCaptures: Move[];
  blackCaptures: Move[];
}

export class HighlightController {
  private state?: State;
  private squareSize?: number;
  private jsx?: React.JSX.Element;

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

  tryRepaint() {
    if (!this.state || !this.squareSize) {
      return;
    }
    this.tryCreateReactComponent();

    this.repaint();
  }

  private tryCreateReactComponent() {
    log("tryCreateReactComponent");
    const reactContainer = document.createElement("div");
    reactContainer.id = "DUPAA";
    console.log(this.rootElement);
    this.rootElement.appendChild(reactContainer);
    const root = createRoot(reactContainer);
    this.jsx = <HighlighterContainer state={this.state!} squareSize={this.squareSize!} />;
    root.render(this.jsx);
  }

  private repaint() {}
}
