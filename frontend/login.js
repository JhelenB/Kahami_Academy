async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/login-jwt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.access) {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh || '');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', data.user_id || '');

            alert('Login exitoso 👌');
            window.location.href = 'dashboard.html';
        } else {
            alert(data.detail || data.error || 'Error en login');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión con backend');
    }
}