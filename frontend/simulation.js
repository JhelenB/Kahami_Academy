async function upload() {
    const file = document.getElementById('image').files[0];

    if (!file) {
        showResult('⚠️ Por favor selecciona una imagen primero', 'error');
        return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showResult('⚠️ Solo se permiten archivos de imagen', 'error');
        return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showResult('⚠️ La imagen es demasiado grande (máximo 10MB)', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    showLoading();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/simulations/upload/', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            showAnalysis(data.analysis);
        } else {
            showResult('❌ ' + (data.error || 'Error al procesar la imagen'), 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showResult('❌ Error de conexión con el servidor', 'error');
    }
}

function showLoading() {
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result-card loading';
    resultDiv.innerHTML = '<div class="result-title">🔄 Analizando tu rostro con IA...</div>';

    document.getElementById('analysis').style.display = 'none';
}

function showResult(message, type = 'success') {
    const resultDiv = document.getElementById('result');
    resultDiv.className = `result-card ${type}`;
    resultDiv.innerHTML = `<div class="result-title">${message}</div>`;

    document.getElementById('analysis').style.display = 'none';
}

function showAnalysis(analysis) {
    // Mostrar resultado principal
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result-card';
    resultDiv.innerHTML = '<div class="result-title">✅ ¡Análisis completado!</div>';

    // Mostrar análisis detallado
    document.getElementById('analysis').style.display = 'block';

    document.getElementById('face-shape').textContent = analysis.face_shape || 'No disponible';
    document.getElementById('symmetry').textContent = analysis.symmetry || 'No disponible';
    document.getElementById('makeup').textContent = analysis.makeup || 'No disponible';
    document.getElementById('hair-style').textContent = analysis.hair_style || 'No disponible';

    // Animación de entrada
    const items = document.querySelectorAll('.analysis-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Función para reiniciar el análisis
function resetAnalysis() {
    document.getElementById('image').value = '';
    document.getElementById('result').innerHTML = '<div class="result-title">📸 Sube una foto frontal clara para comenzar</div>';
    document.getElementById('result').className = 'result-card';
    document.getElementById('analysis').style.display = 'none';
}
