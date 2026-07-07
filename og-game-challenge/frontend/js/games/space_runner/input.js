export const keys = {
  left: false,
  right: false,
  shoot: false
};

export function setupInput() {
  document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowLeft" || key === "a") {
      keys.left = true;
    }

    if (event.key === "ArrowRight" || key === "d") {
      keys.right = true;
    }

    if (event.code === "Space") {
      event.preventDefault();
      keys.shoot = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowLeft" || key === "a") {
      keys.left = false;
    }

    if (event.key === "ArrowRight" || key === "d") {
      keys.right = false;
    }

    if (event.code === "Space") {
      event.preventDefault();
      keys.shoot = false;
    }
  });
}