document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        errorDiv.style.display = 'none';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // PETICIÓN AL BACKEND (Django puerto 8000)
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar datos de sesión si es necesario
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // REDIRIGIR AL DASHBOARD O SIMULADOR
                window.location.href = 'simulator.html'; 
            } else {
                // Mostrar error del servidor
                errorDiv.textContent = data.error || 'Credenciales inválidas';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            errorDiv.textContent = 'No se pudo conectar con el servidor. ¿Está encendido Django?';
            errorDiv.style.display = 'block';
        }
    });
});