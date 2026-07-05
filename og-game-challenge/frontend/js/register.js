const registerBtn = document.getElementById("registerBtn");
const registerMessage = document.getElementById("registerMessage");

function showMessage(message, type) {
  registerMessage.textContent = message;
  registerMessage.className = `register__message register__message--${type}`;
}

registerBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Please enter a valid email.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.", "error");
    return;
  }

  try {
    const data = await register(username, email, password);

    localStorage.setItem("og_token", data.access_token);
    localStorage.setItem("og_user", JSON.stringify(data.user));

    showMessage(`Welcome, ${data.user.username}. Redirecting...`, "success");

    setTimeout(() => {
      window.location.href = "games.html";
    }, 900);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Registration failed.", "error");
  }
});