document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  
  function showAlert(form, message, type = 'danger') {
    let alertBox = form.querySelector('.auth-alert');
    if (!alertBox) {
      alertBox = document.createElement('div');
      alertBox.className = `alert alert-${type} auth-alert mt-3 rounded-pill text-center py-2 small`;
      form.appendChild(alertBox);
    }
    alertBox.className = `alert alert-${type} auth-alert mt-3 rounded-pill text-center py-2 small`;
    alertBox.textContent = message;
  }

  //registro 
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value.trim();

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(signupForm, data.message, 'danger');
          return;
        }

        showAlert(signupForm, '¡Registro exitoso! Redirigiendo a Login...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
      } catch (err) {
        showAlert(signupForm, 'Error al conectar con el servidor.', 'danger');
      }
    });
  }

  // Manejo de Inicio de Sesión (Login)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(loginForm, data.message, 'danger');
          return;
        }

        showAlert(loginForm, `¡Hola de nuevo, ${data.user.fullName}!`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
      } catch (err) {
        showAlert(loginForm, 'Error al conectar con el servidor.', 'danger');
      }
    });
  }
});