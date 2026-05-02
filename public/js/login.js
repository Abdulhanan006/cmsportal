const form = document.getElementById('loginForm');
const messageBox = document.getElementById('authMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  messageBox.textContent = '';
  messageBox.className = 'form-message';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Login failed.');
    }

    localStorage.setItem('cmsAdminToken', result.data.token);
    window.location.href = '/admin';
  } catch (error) {
    messageBox.textContent = error.message;
    messageBox.classList.add('error');
  }
});
