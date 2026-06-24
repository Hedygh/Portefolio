// ═══════════════════════════════════════
// REGISTER — Mock API (à connecter à Flask plus tard)
// ═══════════════════════════════════════

const registerBtn = document.getElementById('registerBtn');

registerBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();

  // Validation basique
  if (!username || !email) {
    alert('Please fill in all fields.');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }

  // TODO: remplacer par un vrai fetch quand le backend est prêt
  // const res = await fetch('/api/v1/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, email })
  // });

  // Mock — simule une inscription réussie
  console.log('Registering:', { username, email });
  alert(`Welcome, ${username}! Your account has been created.`);
  window.location.href = 'index.html';
});
