import { createFeature } from "../../utils/feature";
import { error, log } from "../../utils/utils";
import { HighlightController } from "./highlight-controller";

const testPGN = `1. d4 d5 2. e4 e5 3. f4 f5 4. g4 Nf6 5. Ne2 Kd7 6. b4 c5 7. bxc5 Kc6 8. Ba3 Qd6 9. Bg2 Rg8 10. O-O Nxg4 11. Ng3 Qh6 12. Nxf5 g6 13. exd5+ Kb5 14. Qd3+ Ka5 15. Qc3+ Kb5 16. Nd6+ Bxd6 17. cxd6 Nc6 18. Qc5+ Ka6 19. Nc3 Nxd4 20. d7 Bxd7 21. Qd6+ Ka5 22. Qc7+ Ka6 23. Qxd7 Rad8 24. Qxg4 exf4 25. h3 f3 26. Bc5 b6 27. a4 Rge8 28. a5 Rc8 29. Rab1 Red8 30. h4`;

let isExecuted = false;

export const HighlighterFeature = createFeature({
  name: "highlighter",
  description: "Highlighter",
  canExecute: (url) => url.includes("/analysis") && !isExecuted,
  execute: async () => {
    isExecuted = true;
    await propagateTestPgn();

    const highlightController = HighlightController.create(
      document.querySelector(".cg-wrap")
    );
    watchForMovesChange(highlightController);
    watchForChessBoardResize(highlightController);
    watchForChessBoardOrientationChange(highlightController);
  },
});

async function propagateTestPgn() {
  const pgnTextareaElement =
    document.querySelector<HTMLTextAreaElement>(".pgn textarea");
  if (!pgnTextareaElement) {
    error("pgn textarea not found");
    return;
  }
  pgnTextareaElement.value = testPGN;
  pgnTextareaElement.focus();

  const importPgnButtonElement =
    document.querySelector<HTMLButtonElement>(".pgn button");
  if (!importPgnButtonElement) {
    error("import pgn button not found");
    return;
  }
  importPgnButtonElement.click();
}

function watchForMovesChange(highlightController: HighlightController) {
  const movesContainer = document.querySelector<HTMLElement>(
    ".analyse__moves.areplay"
  );
  if (!movesContainer) {
    error("movesContainer not found");
    return;
  }

  const callback = () => {
    log("calculating legal moves");
    highlightController.recalculateLegalMoves(getMoves(movesContainer));
    highlightController.tryRepaint();
  };
  callback();
  const observer = new MutationObserver(() => callback);
  observer.observe(movesContainer, { childList: true, subtree: true });
}

function getMoves(schema: HTMLElement) {
  const moves: string[] = [];
  const moveNodes = schema.querySelectorAll("move");
  moveNodes.forEach((moveNode) => {
    let move = moveNode.querySelector("san")?.textContent;
    if (!move) {
      move = moveNode.textContent;
      if (move?.includes(".")) {
        move = move.split(".")[1];
      }
    }
    moves.push(move!);
  });
  return moves;
}

function watchForChessBoardResize(highlightController: HighlightController) {
  const container = document.querySelector<HTMLElement>(".cg-wrap");
  if (!container) {
    error(".cg-wrap not found");
    return;
  }

  const callback = () => {
    log(".cg-wrap resized");
    const bounds = container.getBoundingClientRect();
    const width =
      (Math.floor((bounds.width * window.devicePixelRatio) / 8) * 8) /
      window.devicePixelRatio;
    console.log({width });
    highlightController.setSquareSize(width / 8);
    highlightController.tryRepaint();
  };
  callback();
  // observer resize  of a parentNode
  const observer = new ResizeObserver(callback);
  observer.observe(container);
}

function watchForChessBoardOrientationChange(
  highlightController: HighlightController
) {
  const container = document.querySelector<HTMLElement>("cg-container");
  if (!container) {
    error("<cg-container> not found");
    return;
  }
  const parentNode = container.parentNode as HTMLElement | null;
  // observer mutations of a parentNode
  if (!parentNode) {
    error("<cg-container> has no parentNode");
    return;
  }
  const callback = () => {
    log("<cg-container> mutated");
    highlightController.setOrientation(
      parentNode.classList.contains("orientation-black") ? "black" : "white"
    );
    highlightController.tryRepaint();
  };
  callback();
  const observer = new MutationObserver(() => callback);
  observer.observe(parentNode, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// language=HTML
const chessBoard = `
  '
  <cg-container style="width: 646.4px; height: 646.4px;">
    <cg-board>
      <square class="last-move" style="transform: translate(404px, 323.2px);"></square>
      <square class="last-move" style="transform: translate(323.2px, 242.4px);"></square>
      <piece class="black rook" style="transform: translate(242.4px);"></piece>
      <piece class="black rook" style="transform: translate(484.8px);"></piece>
      <piece class="black pawn" style="transform: translate(0px, 80.8px);"></piece>
      <piece class="black pawn" style="transform: translate(80.8px, 80.8px);"></piece>
      <piece class="black pawn" style="transform: translate(565.6px, 80.8px);"></piece>
      <piece class="black king" style="transform: translate(0px, 161.6px);"></piece>
      <piece class="black pawn" style="transform: translate(484.8px, 161.6px);"></piece>
      <piece class="black queen" style="transform: translate(565.6px, 161.6px);"></piece>
      <piece class="white pawn" style="transform: translate(242.4px, 242.4px);"></piece>
      <piece class="black knight" style="transform: translate(242.4px, 323.2px);"></piece>
      <piece class="black pawn" style="transform: translate(404px, 323.2px);"></piece>
      <piece class="white queen" style="transform: translate(484.8px, 323.2px);"></piece>
      <piece class="white bishop" style="transform: translate(0px, 404px);"></piece>
      <piece class="white knight" style="transform: translate(161.6px, 404px);"></piece>
      <piece class="white pawn" style="transform: translate(0px, 484.8px);"></piece>
      <piece class="white pawn" style="transform: translate(161.6px, 484.8px);"></piece>
      <piece class="white bishop" style="transform: translate(484.8px, 484.8px);"></piece>
      <piece class="white pawn" style="transform: translate(565.6px, 484.8px);"></piece>
      <piece class="white rook" style="transform: translate(0px, 565.6px);"></piece>
      <piece class="white rook" style="transform: translate(404px, 565.6px);"></piece>
      <piece class="white king" style="transform: translate(484.8px, 565.6px);"></piece>
    </cg-board>
  </cg-container>'
`;
