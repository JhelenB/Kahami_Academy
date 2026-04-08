// Login page logic

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorElement = document.getElementById('loginError');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError('loginError');

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showError('loginError', 'Por favor completa todos los campos');
                return;
            }

            try {
                const response = await api.login(username, password);
                saveUser(response.user);
                navigateTo('dashboard.html');
            } catch (error) {
                showError('loginError', error.message || 'Error al iniciar sesión');
            }
        });
    }
});
