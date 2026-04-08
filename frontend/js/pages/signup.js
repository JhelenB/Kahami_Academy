// Signup page logic

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const errorElement = document.getElementById('signupError');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError('signupError');

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();

            // Validaciones
            if (!username || !email || !password) {
                showError('signupError', 'Por favor completa los campos requeridos');
                return;
            }

            if (!isValidEmail(email)) {
                showError('signupError', 'Email inválido');
                return;
            }

            if (password.length < 8) {
                showError('signupError', 'La contraseña debe tener al menos 8 caracteres');
                return;
            }

            try {
                const response = await api.signup(username, email, password, firstName, lastName);
                saveUser(response.user);
                navigateTo('dashboard.html');
            } catch (error) {
                showError('signupError', error.message || 'Error al registrarse');
            }
        });
    }
});
