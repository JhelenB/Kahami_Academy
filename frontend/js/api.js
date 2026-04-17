// ===============================
// API CLIENT KAHAMI - CORREGIDO
// ===============================

class KahamiAPI {
    constructor() {
        // ✅ Aseguramos la URL local correcta
        this.baseURL = 'http://127.0.0.1:8000/api';
        this.timeout = 30000;
    }

    /**
     * Petición genérica con soporte para Credenciales y CORS
     */
    async request(endpoint, method = 'GET', data = null, headers = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const options = {
            method,
            // 🔐 CRÍTICO: Permite que el navegador envíe y reciba cookies de sesión (Session ID)
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Si el error es 403, es probable que falte el Token CSRF
                const errorData = await response.json().catch(() => ({}));
                console.error(`[SERVER ERROR] ${response.status}:`, errorData);
                throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            // Si entra aquí con "Failed to fetch", es un error de CORS o el servidor está apagado
            console.error(`[CONNECTION ERROR] ${endpoint}:`, error);
            throw error; 
        }
    }

    // =========================
    // 🔐 AUTH
    // =========================

   async signup(username, email, password, first_name, last_name) {
    return this.request('/auth/signup/', 'POST', {
        username,
        email,
        password,
        first_name, // Agrega esto
        last_name   // Agrega esto
    });
}

    async login(username, password) {
        // ✅ Aseguramos que el endpoint coincide con el URLconf de Django
        return this.request('/auth/login/', 'POST', {
            username,
            password
        });
    }

    // =========================
    // 🎨 SIMULADOR (CLAVE)
    // =========================

    async simular() {
        return this.request('/simulations/simular/', 'POST');
    }

    // =========================
    // 📊 SIMULACIONES
    // =========================

    async getSimulations() {
        return this.request('/simulations/', 'GET');
    }

    async createSimulation(data) {
        return this.request('/simulations/create/', 'POST', data);
    }

    async deleteSimulation(id) {
        return this.request(`/simulations/delete/${id}/`, 'DELETE');
    }

    // =========================
    // 📚 CURSOS
    // =========================

    async getCourses() {
        return this.request('/courses/', 'GET');
    }

    async getCourse(id) {
        return this.request(`/courses/${id}/`, 'GET');
    }
}

// 🔥 INSTANCIA GLOBAL
const api = new KahamiAPI();

if (typeof window !== 'undefined') {
    window.api = api;
}

export default api;