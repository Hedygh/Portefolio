export const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  shoot: false
};

export function setupInput() {
  document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowLeft" || key === "q") {
      keys.left = true;
    }

    if (event.key === "ArrowRight" || key === "d") {
      keys.right = true;
    }
    if (event.key === "ArrowUp" || key === "z") {
      keys.up = true;
    }

    if (event.key === "ArrowDown" || key === "s") {
      keys.down = true;
    }
    if (event.code === "Space") {
      event.preventDefault();
      keys.shoot = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowLeft" || key === "q") {
      keys.left = false;
    }

    if (event.key === "ArrowRight" || key === "d") {
      keys.right = false;
    }

    if (event.key === "ArrowUp" || key === "z") {
      keys.up = false;
    }

    if (event.key === "ArrowDown" || key === "s") {
      keys.down = false;
    }  

    if (event.code === "Space") {
      event.preventDefault();
      keys.shoot = false;
    }
  });
}