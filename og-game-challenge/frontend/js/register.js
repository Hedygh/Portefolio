const registerBtn = document.getElementById("registerBtn");
const registerMessage = document.getElementById("registerMessage");

function showMessage(message, type) {
  registerMessage.textContent = message;
  registerMessage.className = `register__message register__message--${type}`;
}

registerBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!username || !email) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Please enter a valid email.", "error");
    return;
  }

  try {
    const user = await createUser(username, email);

    localStorage.setItem("og_user", JSON.stringify(user));

    showMessage(`Welcome, ${user.username}. Redirecting...`, "success");

    setTimeout(() => {
      window.location.href = "games.html";
    }, 900);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Registration failed.", "error");
  }
});