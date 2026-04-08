// Dashboard page logic

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const authenticated = await checkAuthStatus();
    if (!authenticated) {
        navigateTo('login.html');
        return;
    }

    // Cargar datos del usuario
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Obtener perfil del usuario
        const profile = await api.getUserProfile();
        if (profile.user) {
            document.getElementById('userNameDisplay').textContent = profile.user.first_name || profile.user.username;
        }

        // Cargar características faciales si existen
        if (profile.facial_features && Object.keys(profile.facial_features).length > 0) {
            displayFacialFeatures(profile.facial_features);
        }

        // Cargar recomendaciones
        loadRecommendations();

        // Cargar simulaciones
        loadSimulations();
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

function displayFacialFeatures(features) {
    const display = document.getElementById('facialFeaturesDisplay');
    if (display) {
        let html = '<div class="features-list">';
        for (const [key, value] of Object.entries(features)) {
            html += `<p><strong>${key}:</strong> ${JSON.stringify(value)}</p>`;
        }
        html += '</div>';
        display.innerHTML = html;
    }
}

async function loadRecommendations() {
    try {
        const recommendations = await api.getUserRecommendations();
        const display = document.getElementById('recommendationsDisplay');
        
        if (recommendations.length === 0) {
            display.innerHTML = '<p>Completa una simulación para obtener recomendaciones personalizadas</p>';
            return;
        }

        const latest = recommendations[0];
        let html = '<div class="recommendations-list">';
        
        if (latest.recommended_courses && latest.recommended_courses.length > 0) {
            html += '<h5>Cursos recomendados:</h5><ul>';
            latest.recommended_courses.forEach(courseId => {
                html += `<li>Curso ID: ${courseId}</li>`;
            });
            html += '</ul>';
        }

        if (latest.score) {
            html += `<p><strong>Score de relevancia:</strong> ${(latest.score * 100).toFixed(1)}%</p>`;
        }

        html += '</div>';
        display.innerHTML = html;
    } catch (error) {
        console.error('Error cargando recomendaciones:', error);
    }
}

async function loadSimulations() {
    try {
        const simulations = await api.getSimulations();
        const gallery = document.getElementById('simulationsGallery');

        if (simulations.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <p>No hay simulaciones aún. Crea tu primera simulación para ver el historial.</p>
                    <a href="#" onclick="navigateTo('simulator.html')" class="btn btn-primary">Ir al Simulador</a>
                </div>
            `;
            return;
        }

        let html = '<div class="simulations-grid">';
        
        simulations.forEach(sim => {
            const date = new Date(sim.created_at);
            const formattedDate = date.toLocaleDateString('es-ES');
            const formattedTime = date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
            
            html += `
                <div class="simulation-card">
                    <div class="simulation-header">
                        <h5>${getSimulatorName(sim.simulation_type)}</h5>
                        <span class="simulation-date">${formattedDate}</span>
                    </div>
                    <div class="simulation-info">
                        <p><strong>Tipo:</strong> ${sim.simulation_type}</p>
                        <p><strong>Hora:</strong> ${formattedTime}</p>
                        ${sim.parameters ? `<p><strong>Parámetros:</strong> ${JSON.stringify(sim.parameters).slice(0, 50)}...</p>` : ''}
                    </div>
                    <div class="simulation-actions">
                        <button class="btn btn-small btn-secondary" onclick="viewSimulation(${sim.id})">Ver</button>
                        <button class="btn btn-small btn-danger" onclick="deleteSimulation(${sim.id})">Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        gallery.innerHTML = html;
    } catch (error) {
        console.error('Error cargando simulaciones:', error);
    }
}

/**
 * Obtener nombre legible del simulador
 */
function getSimulatorName(type) {
    const names = {
        'micropigmentation': 'Micropigmentación',
        'microblading': 'Microblading',
        'lashes': 'Extensiones de Pestañas',
        'nails': 'Diseño de Uñas',
        'hairColor': 'Color de Cabello'
    };
    return names[type] || type;
}

/**
 * Ver simulación (placeholder)
 */
function viewSimulation(id) {
    alert(`Simulación #${id} - Funcionalidad en desarrollo`);
}

async function deleteSimulation(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta simulación?')) {
        try {
            await api.deleteSimulation(id);
            loadSimulations();
        } catch (error) {
            alert('Error al eliminar simulación');
        }
    }
}
