// Memoria del programa
let imgCargada = false;
let registros = []; 

const input = document.getElementById('subirFoto');
const canvas = document.getElementById('canvasIA');
const ctx = canvas.getContext('2d');
const contenedor = document.getElementById('areaCanvas');

// 1. Cargar Imagen al Canvas
input.onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Ajustar tamaño
            const scale = Math.min(contenedor.clientWidth / img.width, contenedor.clientHeight / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            imgCargada = true;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
};

// 2. Navegación entre pestañas
function cambiarSeccion(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('sec-' + id).classList.add('active');
    btn.classList.add('active');

    if (id === 'historial') mostrarTabla();
}

// 3. Guardar en Historial (Funcionalidad Recuperada)
function ejecutarAnalisis() {
    if (!imgCargada) return alert("Sube una imagen primero");

    const nuevoDato = {
        fecha: new Date().toLocaleDateString(),
        id: "#KH-" + Math.floor(Math.random() * 9000 + 1000),
        status: "Análisis Completado"
    };

    registros.push(nuevoDato);
    alert("Simulación guardada con éxito.");
}

// 4. Renderizar la tabla
function mostrarTabla() {
    const lista = document.getElementById('cuerpoHistorial');
    if (registros.length === 0) {
        lista.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay registros previos.</td></tr>';
        return;
    }

    lista.innerHTML = registros.map(r => `
        <tr>
            <td>${r.fecha}</td>
            <td style="color:#6366f1; font-weight:bold;">${r.id}</td>
            <td>${r.status}</td>
        </tr>
    `).join('');
}