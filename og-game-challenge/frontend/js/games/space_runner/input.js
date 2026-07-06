export const keys = {
  left: false,
  right: false
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
  });

  document.addEventListener("keyup", function (event) {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowLeft" || key === "a") {
      keys.left = false;
    }

    if (event.key === "ArrowRight" || key === "d") {
      keys.right = false;
    }
  });
}
