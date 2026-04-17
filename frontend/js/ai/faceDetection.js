// Face Detection using face-api.js
// Versión corregida para GitHub Pages

const FACE_API_MODELS_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';

let faceAPIReady = false;

/**
 * Inicializar modelos de face-api.js
 */
async function initFaceDetection() {
    console.log('[v0] Inicializando detección facial...');

    try {
        // Verificar face-api disponible
        if (typeof faceapi === 'undefined') {
            console.error('[v0] face-api.js NO está cargado');
            return false;
        }

        // Cargar modelos necesarios (ESTABLE)
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODELS_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODELS_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_MODELS_URL),
        ]);

        faceAPIReady = true;
        console.log('[v0] Modelos cargados correctamente ✔');
        return true;

    } catch (error) {
        console.error('[v0] Error al inicializar face-api.js:', error);
        return false;
    }
}

/**
 * Detectar rostro en imagen o canvas
 */
async function detectFace(imageOrCanvas) {

    if (!faceAPIReady) {
        await initFaceDetection();
    }

    try {
        console.log('[v0] Detectando rostro...');

        const detections = await faceapi
            .detectAllFaces(
                imageOrCanvas,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

        if (!detections || detections.length === 0) {
            console.warn('[v0] No se detectó ningún rostro');
            return null;
        }

        console.log('[v0] Rostro detectado ✔');
        return detections[0];

    } catch (error) {
        console.error('[v0] Error en detección facial:', error);
        return null;
    }
}

/**
 * Detectar múltiples rostros
 */
async function detectMultipleFaces(imageOrCanvas) {

    if (!faceAPIReady) {
        await initFaceDetection();
    }

    try {
        const detections = await faceapi
            .detectAllFaces(
                imageOrCanvas,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

        return detections || [];

    } catch (error) {
        console.error('[v0] Error detectando múltiples rostros:', error);
        return [];
    }
}

/**
 * Bounding box del rostro
 */
function getFaceBoundingBox(detection) {

    if (!detection || !detection.detection) return null;

    const box = detection.detection.box;

    return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        center: {
            x: box.x + box.width / 2,
            y: box.y + box.height / 2
        }
    };
}

/**
 * Landmarks faciales
 */
function getFaceLandmarks(detection) {

    if (!detection || !detection.landmarks) return null;

    const landmarks = detection.landmarks;

    return {
        positions: landmarks.positions,
        leftEye: landmarks.getLeftEye(),
        rightEye: landmarks.getRightEye(),
        mouth: landmarks.getMouth(),
        nose: landmarks.getNose(),
        jawOutline: landmarks.getJawOutline()
    };
}

/**
 * Expresiones faciales
 */
function getFaceExpressions(detection) {

    if (!detection || !detection.expressions) return null;

    const exp = detection.expressions;

    // Buscar emoción dominante
    let dominant = 'neutral';
    let max = 0;

    Object.keys(exp).forEach(key => {
        if (exp[key] > max) {
            max = exp[key];
            dominant = key;
        }
    });

    return {
        neutral: exp.neutral,
        happy: exp.happy,
        sad: exp.sad,
        angry: exp.angry,
        fearful: exp.fearful,
        disgusted: exp.disgusted,
        surprised: exp.surprised,
        dominant
    };
}

/**
 * Dibujar detección en canvas
 */
function drawFaceDetection(canvas, detection) {

    if (!detection) return;

    const ctx = canvas.getContext('2d');

    const displaySize = {
        width: canvas.width,
        height: canvas.height
    };

    faceapi.matchDimensions(canvas, displaySize);

    const resized = faceapi.resizeResults([detection], displaySize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resized.forEach(d => {

        const box = d.detection.box;

        // Caja rostro
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Landmarks
        if (d.landmarks) {
            ctx.fillStyle = '#EC4899';

            d.landmarks.positions.forEach(p => {
                ctx.fillRect(p.x, p.y, 2, 2);
            });
        }
    });
}

/**
 * Inicialización segura automática
 */
(async function autoInit() {
    try {
        await initFaceDetection();
    } catch (e) {
        console.warn('[v0] Auto init falló, se reintentará al usar detectFace');
    }
})();