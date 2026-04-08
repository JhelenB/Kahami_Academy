// Simulator page logic
let currentSimulatorType = null;
let currentImage = null;
let canvasElement = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    await checkAuthStatus();

    // Setup upload area
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.backgroundColor = '';
        });
        uploadArea.addEventListener('drop', async (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                imageInput.files = files;
                await handleImageSelect();
            }
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelect);
    }

    // Setup canvas
    canvasElement = document.getElementById('simulationCanvas');

    // Inicializar face-api.js
    await initializeFaceAPI();
});

async function handleImageSelect() {
    const imageInput = document.getElementById('imageInput');
    if (!imageInput.files.length) return;

    try {
        currentImage = await loadImage(imageInput);
        displayImageOnCanvas();
    } catch (error) {
        alert('Error al cargar la imagen: ' + error.message);
    }
}

function displayImageOnCanvas() {
    if (!canvasElement || !currentImage) return;

    canvasElement.width = currentImage.width;
    canvasElement.height = currentImage.height;

    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(currentImage, 0, 0);
}

function selectSimulator(type) {
    currentSimulatorType = type;

    // Actualizar botones activos
    document.querySelectorAll('.simulator-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Mostrar parámetros para este simulador
    updateParametersPanel(type);

    // Habilitar botón de simulación
    const simulateBtn = document.getElementById('simulateBtn');
    if (simulateBtn) {
        simulateBtn.disabled = false;
    }
}

function updateParametersPanel(type) {
    const panel = document.getElementById('parametersPanel');
    const parameters = {
        micropigmentation: `
            <div class="form-group">
                <label>Color (hex)</label>
                <input type="color" id="pigmentColor" value="#000000">
            </div>
            <div class="form-group">
                <label>Densidad (%)</label>
                <input type="range" id="density" min="0" max="100" value="70">
            </div>
        `,
        microblading: `
            <div class="form-group">
                <label>Color (hex)</label>
                <input type="color" id="bladeColor" value="#2C1810">
            </div>
            <div class="form-group">
                <label>Grosor de línea</label>
                <input type="range" id="lineThickness" min="1" max="5" value="2">
            </div>
        `,
        lashes: `
            <div class="form-group">
                <label>Largo (%)</label>
                <input type="range" id="lashLength" min="0" max="100" value="50">
            </div>
            <div class="form-group">
                <label>Volumen</label>
                <select id="lashVolume">
                    <option value="natural">Natural</option>
                    <option value="medium">Medio</option>
                    <option value="dramatic">Dramático</option>
                </select>
            </div>
        `,
        nails: `
            <div class="form-group">
                <label>Color (hex)</label>
                <input type="color" id="nailColor" value="#FF69B4">
            </div>
            <div class="form-group">
                <label>Forma</label>
                <select id="nailShape">
                    <option value="square">Cuadrada</option>
                    <option value="oval">Ovalada</option>
                    <option value="almond">Almendra</option>
                </select>
            </div>
        `,
        hairColor: `
            <div class="form-group">
                <label>Color (hex)</label>
                <input type="color" id="hairColor" value="#8B4513">
            </div>
            <div class="form-group">
                <label>Intensidad (%)</label>
                <input type="range" id="colorIntensity" min="0" max="100" value="70">
            </div>
        `
    };

    if (panel) {
        panel.innerHTML = parameters[type] || '<p>Sin parámetros</p>';
    }
}

async function runSimulation() {
    if (!currentSimulatorType || !currentImage) {
        alert('Por favor selecciona un tipo de simulación y carga una imagen');
        return;
    }

    console.log('[v0] Ejecutando simulación:', currentSimulatorType);

    try {
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.disabled = true;
        simulateBtn.textContent = 'Analizando...';

        // Analizar imagen primero
        const analysis = await analyzeImage();
        if (!analysis) {
            simulateBtn.disabled = false;
            simulateBtn.textContent = 'Ejecutar Simulación';
            return;
        }

        // Guardar análisis en sesión
        sessionStorage.setItem('lastAnalysis', JSON.stringify({
            features: analysis.features,
            profile: analysis.profile
        }));

        simulateBtn.textContent = 'Ejecutando simulación...';

        // Ejecutar simulador específico
        let resultCanvas;

        switch (currentSimulatorType) {
            case 'micropigmentation':
                resultCanvas = await simulateMicropigmentation(
                    canvasElement,
                    analysis.features,
                    getSimulationParameters('micropigmentation')
                );
                break;
            case 'microblading':
                resultCanvas = await simulateMicroblading(
                    canvasElement,
                    analysis.features,
                    getSimulationParameters('microblading')
                );
                break;
            case 'lashes':
                resultCanvas = await simulateLashes(
                    canvasElement,
                    analysis.features,
                    getSimulationParameters('lashes')
                );
                break;
            case 'nails':
                resultCanvas = await simulateNails(
                    canvasElement,
                    analysis.features,
                    getSimulationParameters('nails')
                );
                break;
            case 'hairColor':
                resultCanvas = await simulateHairColor(
                    canvasElement,
                    analysis.features,
                    getSimulationParameters('hairColor')
                );
                break;
            default:
                alert('Simulador no implementado');
                simulateBtn.disabled = false;
                simulateBtn.textContent = 'Ejecutar Simulación';
                return;
        }

        // Habilitar botón de guardado
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = false;

        console.log('[v0] Simulación completada');
        alert('¡Simulación completada! Puedes guardar el resultado o probar otro simulador.');

        simulateBtn.disabled = false;
        simulateBtn.textContent = 'Ejecutar Simulación';
    } catch (error) {
        console.error('[v0] Error en simulación:', error);
        alert('Error ejecutando simulación: ' + error.message);
        
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.disabled = false;
        simulateBtn.textContent = 'Ejecutar Simulación';
    }
}

/**
 * Obtener parámetros de simulación del formulario
 */
function getSimulationParameters(type) {
    const params = {};

    switch (type) {
        case 'micropigmentation':
            params.color = document.getElementById('pigmentColor')?.value || '#000000';
            params.density = parseInt(document.getElementById('density')?.value || 70);
            break;
        case 'microblading':
            params.color = document.getElementById('bladeColor')?.value || '#2C1810';
            params.lineThickness = parseInt(document.getElementById('lineThickness')?.value || 2);
            break;
        case 'lashes':
            params.length = parseInt(document.getElementById('lashLength')?.value || 50);
            params.volume = document.getElementById('lashVolume')?.value || 'natural';
            break;
        case 'nails':
            params.color = document.getElementById('nailColor')?.value || '#FF69B4';
            params.shape = document.getElementById('nailShape')?.value || 'square';
            break;
        case 'hairColor':
            params.color = document.getElementById('hairColor')?.value || '#8B4513';
            params.intensity = parseInt(document.getElementById('colorIntensity')?.value || 70);
            break;
    }

    return params;
}

async function saveSimulation() {
    if (!isAuthenticated()) {
        navigateTo('login.html');
        return;
    }

    if (!currentSimulatorType || !canvasElement) {
        alert('No hay simulación para guardar');
        return;
    }

    try {
        alert('Guardado de simulaciones será disponible en próximos sprints');
    } catch (error) {
        alert('Error al guardar simulación');
    }
}

async function initializeFaceAPI() {
    console.log('[v0] Inicializando face-api.js...');
    
    const ready = await initFaceDetection();
    if (ready) {
        console.log('[v0] Face-api inicializado correctamente');
        return true;
    } else {
        console.error('[v0] Error inicializando face-api');
        alert('Error al cargar los modelos de IA. Por favor recarga la página.');
        return false;
    }
}

async function analyzeImage() {
    if (!currentImage || !canvasElement) {
        alert('Por favor carga una imagen primero');
        return null;
    }

    console.log('[v0] Analizando imagen...');

    try {
        // Detectar rostro
        const detection = await detectFace(currentImage);
        if (!detection) {
            alert('No se detectó ningún rostro. Por favor usa una foto clara de tu rostro.');
            return null;
        }

        console.log('[v0] Rostro detectado');

        // Dibujar detección en canvas (para visualización)
        drawFaceDetection(canvasElement, detection);

        // Analizar características
        const features = await analyzeFacialFeatures(detection, canvasElement);
        if (!features) {
            alert('Error al analizar características faciales');
            return null;
        }

        console.log('[v0] Características analizadas:', features);

        // Generar perfil y recomendaciones
        const profile = generateFeatureProfile(features);

        return {
            detection,
            features,
            profile
        };
    } catch (error) {
        console.error('[v0] Error en análisis:', error);
        alert('Error al analizar la imagen: ' + error.message);
        return null;
    }
}
