import { createFeature } from "../../utils/feature";
import { error, log } from "../../utils/utils";
import { HighlightController } from "./highlight-controller";
import { retry } from "../../utils/time";

const testPGN = `1. d4 d5 2. e4 e5 3. f4 f5 4. g4 Nf6 5. Ne2 Kd7 6. b4 c5 7. bxc5 Kc6 8. Ba3 Qd6 9. Bg2 Rg8 10. O-O Nxg4 11. Ng3 Qh6 12. Nxf5 g6 13. exd5+ Kb5 14. Qd3+ Ka5 15. Qc3+ Kb5 16. Nd6+ Bxd6 17. cxd6 Nc6 18. Qc5+ Ka6 19. Nc3 Nxd4 20. d7 Bxd7 21. Qd6+ Ka5 22. Qc7+ Ka6 23. Qxd7 Rad8 24. Qxg4 exf4 25. h3 f3 26. Bc5 b6 27. a4 Rge8 28. a5 Rc8 29. Rab1 Red8 30. h4`;

let isExecuted = false;

export const HighlighterFeature = createFeature({
  name: "highlighter",
  description: "Highlighter",
  canExecute: (url) => document.querySelector(".cg-wrap")!! && !isExecuted,
  execute: async (url) => {
    isExecuted = true;
    if (url.includes("/analysis")) {
      await propagateTestPgn();
    }

    const highlightController = HighlightController.create(
      document.querySelector(".cg-wrap")
    );
    retry(() => watchForMovesChange(highlightController), 1000, 31);
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
  const movesContainerAnalysisMode = document.querySelector<HTMLElement>(
    ".analyse__moves.areplay"
  );
  if (movesContainerAnalysisMode) {
    log("watching for moves change in analysis mode");
    const callback = () => {
      log("calculating legal moves");
      highlightController.recalculateLegalMoves(
        getMovesAnalysisMode(movesContainerAnalysisMode)
      );
      highlightController.tryRepaint();
    };
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(movesContainerAnalysisMode, {
      attributeFilter: ["class"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    return;
  }

  const movesContainerMatchMode = document.querySelector<HTMLElement>("l4x");
  if (movesContainerMatchMode) {
    log("watching for moves change in match mode");
    const callback = () => {
      log("calculating legal moves");
      highlightController.recalculateLegalMoves(
        getMovesMatchMode(movesContainerMatchMode)
      );
      highlightController.tryRepaint();
    };
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(movesContainerMatchMode, {
      attributeFilter: ["class"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return;
  }

  throw Error("moves container not found");
}

function getMovesAnalysisMode(schema: HTMLElement) {
  const moves: string[] = [];
  const moveNodes = schema.querySelectorAll("move");
  for (let i = 0; i < moveNodes.length; i++) {
    const moveNode = moveNodes[i];
    let move = moveNode.querySelector("san")?.textContent;
    if (!move) {
      move = moveNode.textContent;
      if (move?.includes(".")) {
        move = move.split(".")[1];
      }
    }
    moves.push(move!);
    if (moveNode.classList.contains("active")) {
      break;
    }
  }
  return moves;
}

function getMovesMatchMode(schema: HTMLElement) {
  const moves: string[] = [];
  const moveNodes = schema.querySelectorAll("kwdb");
  for (let i = 0; i < moveNodes.length; i++){
    const moveNode = moveNodes[i];
    const move = moveNode.textContent;
    moves.push(move!);
    if (moveNode.classList.contains("a1t")) {
      break;
    }
  }
  return moves;
}

function watchForChessBoardResize(highlightController: HighlightController) {
  const container = document.querySelector<HTMLElement>(".cg-wrap");
  if (!container) {
    error(".cg-wrap not found");
    return;
  }

  const callback = () => {
    log("resize event triggered");
    const bounds = container.getBoundingClientRect();
    const width =
      (Math.floor((bounds.width * window.devicePixelRatio) / 8) * 8) /
      window.devicePixelRatio;
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
  const observer = new MutationObserver(callback);
  observer.observe(parentNode, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
