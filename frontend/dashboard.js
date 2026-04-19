// 🔥 1. verificar token al entrar
const token = localStorage.getItem('access');

if (!token) {
    alert('No autorizado. Inicia sesión.');
    window.location.href = 'login.html';
}

let currentUserId = localStorage.getItem('userId') || '';

async function getProfile() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (response.ok) {
            const name = data.name || data.user || 'Usuario';
            const email = data.email || '';
            currentUserId = data.id || currentUserId;
            localStorage.setItem('userId', currentUserId);
            document.getElementById('userInfo').innerText = `Bienvenido: ${name}` + (email ? ` (${email})` : '');
        } else {
            document.getElementById('userInfo').innerText = 'Error al cargar usuario';
            if (response.status === 401 || response.status === 403) {
                logout();
            }
        }
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        document.getElementById('userInfo').innerText = 'Error al cargar usuario';
    }
}

// ejecutar al cargar página
getProfile();

function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}