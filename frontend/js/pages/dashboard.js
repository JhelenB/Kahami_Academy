async function loadDashboard() {
    const token = localStorage.getItem('userToken');
    if (!token) window.location.href = 'login.html';

    try {
        // Cargar simulaciones guardadas
        const simRes = await fetch('http://localhost:8000/api/simulations/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        const simulations = await simRes.json();
        
        // Renderizar en el contenedor (asegúrate de tener este ID en dashboard.html)
        const container = document.getElementById('history-container');
        container.innerHTML = simulations.map(sim => `
            <div class="card">
                <img src="${sim.image_data}" width="100%">
                <p>Tipo: ${sim.simulation_type}</p>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error al cargar dashboard", err);
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);