import { Game } from "./game.js";
import { setupInput } from "./input.js";

const canvas = document.getElementById("gameCanvas");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const gameMessage = document.getElementById("gameMessage");

setupInput();

const game = new Game(canvas, scoreElement, gameMessage);

startBtn.addEventListener("click", function () {
  game.start();
});

game.draw();
