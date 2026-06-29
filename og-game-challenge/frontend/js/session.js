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

function logout() {
  localStorage.removeItem("og_user");
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
      <a href="register.html" class="navbar__login">REGISTER</a>
    `;
  }
}

updateNavbar();