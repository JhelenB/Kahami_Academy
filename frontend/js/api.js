// API Client para comunicación con backend Django
class KahamiAPI {
constructor() {
    this.baseURL = 'https://kahami-academy.onrender.com/api';
    this.timeout = 30000;
}
    /**
     * Realizar petición HTTP genérica
     */
    async request(endpoint, method = 'GET', data = null, headers = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            credentials: 'omit'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            throw error;
        }
    }

    // ========== AUTH ENDPOINTS ==========
    
    async signup(username, email, password, firstName = '', lastName = '') {
        return this.request('/auth/signup/', 'POST', {
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName
        });
    }

    async login(username, password) {
        return this.request('/auth/login/', 'POST', {
            username,
            password
        });
    }

    async logout() {
        return this.request('/auth/logout/', 'POST');
    }

    async checkAuth() {
        return this.request('/auth/check/', 'GET');
    }

    async getUserProfile() {
        return this.request('/auth/profile/', 'GET');
    }

    async updateProfile(facialFeatures, preferences) {
        return this.request('/auth/profile/update/', 'PATCH', {
            facial_features: facialFeatures,
            preferences: preferences
        });
    }

    // ========== SIMULATIONS ENDPOINTS ==========
    
    async getSimulations() {
        return this.request('/simulations/', 'GET');
    }

    async createSimulation(simulationType, originalImageUrl, resultImageUrl, parameters, facialFeatures) {
        return this.request('/simulations/create/', 'POST', {
            simulation_type: simulationType,
            original_image_url: originalImageUrl,
            result_image_url: resultImageUrl,
            parameters,
            facial_features: facialFeatures
        });
    }

    async getSimulation(id) {
        return this.request(`/simulations/${id}/`, 'GET');
    }

    async deleteSimulation(id) {
        return this.request(`/simulations/${id}/delete/`, 'DELETE');
    }

    // ========== RECOMMENDATIONS ENDPOINTS ==========
    
    async generateRecommendations(facialFeatures) {
        return this.request('/recommendations/generate/', 'POST', {
            facial_features: facialFeatures
        });
    }

    async getUserRecommendations() {
        return this.request('/recommendations/', 'GET');
    }

    // ========== COURSES ENDPOINTS ==========
    
    async getCourses(simulatorType = null) {
        let endpoint = '/courses/';
        if (simulatorType) {
            endpoint += `?simulator_type=${simulatorType}`;
        }
        return this.request(endpoint, 'GET');
    }

    async getCourse(id) {
        return this.request(`/courses/${id}/`, 'GET');
    }
}

// Instancia global
const api = new KahamiAPI();
