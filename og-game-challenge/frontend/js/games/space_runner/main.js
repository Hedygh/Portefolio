import { Game } from "./game.js";
import { setupInput } from "./input.js";

const canvas = document.getElementById("gameCanvas");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const gameMessage = document.getElementById("gameMessage");
const levelElement = document.getElementById("level");

setupInput();

const game = new Game(canvas, scoreElement, levelElement, gameMessage);

startBtn.addEventListener("click", function () {
  game.start();
});

game.draw();

// ═══════════════════════════════════════
// EXPAND MODE
// ═══════════════════════════════════════

const gameLayout = document.querySelector(".space-runner-layout");
const expandBtn = document.getElementById("expandBtn");
const exitExpandBtn = document.getElementById("exitExpandBtn");

if (expandBtn && exitExpandBtn && gameLayout) {
  expandBtn.addEventListener("click", () => {
    document.body.classList.add("space-runner-expanded");
    gameLayout.classList.add("space-runner-layout--expanded");

    expandBtn.hidden = true;
    exitExpandBtn.hidden = false;
  });

  exitExpandBtn.addEventListener("click", () => {
    document.body.classList.remove("space-runner-expanded");
    gameLayout.classList.remove("space-runner-layout--expanded");

    expandBtn.hidden = false;
    exitExpandBtn.hidden = true;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.classList.remove("space-runner-expanded");
      gameLayout.classList.remove("space-runner-layout--expanded");

      expandBtn.hidden = false;
      exitExpandBtn.hidden = true;
    }
  });
}