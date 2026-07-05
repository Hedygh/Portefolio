// ═══════════════════════════════════════
// SESSION — Local user state and navbar
// ═══════════════════════════════════════

function getCurrentUser() {
  const user = localStorage.getItem("og_user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

function getCurrentToken() {
  return localStorage.getItem("og_token");
}

function logout() {
  localStorage.removeItem("og_user");
  localStorage.removeItem("og_token");
  window.location.href = "index.html";
}

function updateNavbar() {
  const authArea = document.getElementById("authArea");

  if (!authArea) {
    return;
  }

  const user = getCurrentUser();

  if (user) {
    authArea.innerHTML = `
      <div class="navbar__auth">
        <span class="navbar__user">${user.username}</span>
        <button class="navbar__login" id="logoutBtn">LOGOUT</button>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", logout);
  } else {
    authArea.innerHTML = `
      <div class="navbar__auth">
        <a href="register.html" class="navbar__login">REGISTER</a>
        <a href="login.html" class="navbar__login">LOGIN</a>
      </div>
    `;
  }
}

function updateHomeCTA() {
  const registerSection = document.getElementById("registerSection");

  if (!registerSection) {
    return;
  }

  if (getCurrentUser()) {
    registerSection.style.display = "none";
  } else {
    registerSection.style.display = "flex";
  }
}

updateNavbar();
updateHomeCTA();