// Utilidades de autenticación

/**
 * Verificar estado de autenticación
 */
async function checkAuthStatus() {
    try {
        const response = await api.checkAuth();
        const authenticated = response.authenticated === true;
        
        updateNavBar(authenticated, response.user);
        
        // Redirigir si se accede a página protegida sin autenticación
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const protectedPages = ['dashboard.html', 'simulator.html'];
        
        if (protectedPages.includes(currentPage) && !authenticated) {
            navigateTo('login.html');
        }
        
        return authenticated;
    } catch (error) {
        // No autenticado
        updateNavBar(false);
        return false;
    }
}

/**
 * Actualizar navbar según estado de autenticación
 */
function updateNavBar(authenticated, user = null) {
    const authLink = document.getElementById('authLink');
    
    if (authLink) {
        if (authenticated && user) {
            authLink.innerHTML = `<a href="#" onclick="logout()">Cerrar Sesión (${user.username})</a>`;
        } else {
            authLink.innerHTML = `<a href="#" onclick="navigateTo('login.html')">Iniciar Sesión</a>`;
        }
    }
}

/**
 * Logout
 */
async function logout() {
    try {
        await api.logout();
        localStorage.removeItem('user');
        navigateTo('index.html');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
}

/**
 * Guardar usuario en localStorage
 */
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Obtener usuario de localStorage
 */
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * Verificar si está autenticado (desde localStorage)
 */
function isAuthenticated() {
    return getUser() !== null;
}
