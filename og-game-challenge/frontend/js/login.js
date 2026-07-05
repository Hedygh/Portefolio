const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message, type) {
  loginMessage.textContent = message;
  loginMessage.className = `register__message register__message--${type}`;
}

loginBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  try {
    const data = await login(username, password);

    localStorage.setItem("og_token", data.access_token);
    localStorage.setItem("og_user", JSON.stringify(data.user));

    showMessage(`Welcome back, ${data.user.username}. Redirecting...`, "success");

    setTimeout(() => {
      window.location.href = "games.html";
    }, 900);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Login failed.", "error");
  }
});
