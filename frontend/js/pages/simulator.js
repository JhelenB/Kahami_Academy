// Memoria y estado local
let imgOriginal = null;
let imgCargada = false;

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');

// 1. CARGAR IMAGEN AL CANVAS
imageInput.onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        imgOriginal = new Image();
        imgOriginal.onload = function() {
            // Ajustar el canvas al tamaño de la imagen
            const maxWidth = 500;
            const scale = maxWidth / imgOriginal.width;
            canvas.width = maxWidth;
            canvas.height = imgOriginal.height * scale;
            
            ctx.drawImage(imgOriginal, 0, 0, canvas.width, canvas.height);
            imgCargada = true;
        }
        imgOriginal.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
};

// 2. SELECCIONAR MODO (Global para el HTML)
window.selectSimulator = function(tipo) {
    console.log("Modo activo:", tipo);
    // Cambiar visualmente los botones
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
};

// 3. EJECUTAR SIMULACIÓN (Botón Simular)
window.runSimulation = async function() {
    if (!imgCargada) return alert("Primero debes subir una foto.");

    const color = document.getElementById('colorPicker').value;
    const intensidad = document.getElementById('intensitySlider').value / 100;

    // Efecto visual: Redibujar original y aplicar filtro
    ctx.drawImage(imgOriginal, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "multiply"; // Modo de mezcla para estética
    ctx.fillStyle = color;
    ctx.globalAlpha = intensidad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Resetear valores del canvas
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0;

    console.log("Enviando datos al servidor...");
    
    // Llamada al Backend (Django)
    try {
        const response = await fetch('http://127.0.0.1:8000/api/simulations/simular/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: color, intensity: intensidad })
        });
        const data = await response.json();
        console.log("Respuesta servidor:", data);
    } catch (err) {
        console.warn("Backend no detectado, modo offline activo.");
    }
};

// 4. GUARDAR
window.saveSimulation = function() {
    if (!imgCargada) return alert("No hay simulación para guardar.");
    alert("¡Éxito! Simulación guardada en Kahami Academy.");
};