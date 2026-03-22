// Face Detection using face-api.js
// Sprint 2 - Implementado

const FACE_API_MODELS_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@0.0.5/model/';
let faceAPIReady = false;

/**
 * Inicializar modelos de face-api.js
 */
async function initFaceDetection() {
    console.log('[v0] Inicializando detección facial...');
    
    try {
        // Verificar que face-api está disponible
        if (typeof faceapi === 'undefined') {
            console.error('[v0] face-api.js no está cargado');
            return false;
        }

        // Cargar modelos requeridos
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODELS_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODELS_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_MODELS_URL),
            faceapi.nets.faceDescriptorNet.loadFromUri(FACE_API_MODELS_URL),
        ]);

        faceAPIReady = true;
        console.log('[v0] Modelos de face-api.js cargados correctamente');
        return true;
    } catch (error) {
        console.error('[v0] Error al inicializar face-api.js:', error);
        return false;
    }
}

/**
 * Detectar rostro en imagen con landmarks y expresiones
 */
async function detectFace(imageOrCanvas) {
    if (!faceAPIReady) {
        await initFaceDetection();
    }

    try {
        console.log('[v0] Detectando rostro...');

        // Detectar rostro con tiny face detector (rápido)
        const detections = await faceapi
            .detectAllFaces(imageOrCanvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        if (!detections || detections.length === 0) {
            console.warn('[v0] No se detectó ningún rostro');
            return null;
        }

        console.log('[v0] Rostro detectado:', detections[0]);
        
        // Retornar el primer rostro detectado (el más grande/principal)
        return detections[0];
    } catch (error) {
        console.error('[v0] Error en detección facial:', error);
        return null;
    }
}

/**
 * Detectar múltiples rostros (para casos especiales)
 */
async function detectMultipleFaces(imageOrCanvas) {
    if (!faceAPIReady) {
        await initFaceDetection();
    }

    try {
        const detections = await faceapi
            .detectAllFaces(imageOrCanvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        return detections || [];
    } catch (error) {
        console.error('[v0] Error detectando múltiples rostros:', error);
        return [];
    }
}

/**
 * Obtener bounding box del rostro detectado
 */
function getFaceBoundingBox(detection) {
    if (!detection || !detection.detection) {
        return null;
    }

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
 * Obtener landmarks faciales (puntos clave)
 */
function getFaceLandmarks(detection) {
    if (!detection || !detection.landmarks) {
        return null;
    }

    const landmarks = detection.landmarks;
    
    return {
        positions: landmarks.positions,
        
        // Puntos específicos de interés
        leftEye: landmarks.getLeftEye(),
        rightEye: landmarks.getRightEye(),
        leftEyeBrow: landmarks.getLeftEyeBrow(),
        rightEyeBrow: landmarks.getRightEyeBrow(),
        mouth: landmarks.getMouth(),
        nose: landmarks.getNose(),
        jawOutline: landmarks.getJawOutline(),
        
        // Todas las posiciones
        allPoints: landmarks.positions
    };
}

/**
 * Obtener expresiones faciales detectadas
 */
function getFaceExpressions(detection) {
    if (!detection || !detection.expressions) {
        return null;
    }

    const expressions = detection.expressions;
    
    // Retornar expresiones con valores normalizados (0-1)
    return {
        neutral: expressions.neutral,
        happy: expressions.happy,
        sad: expressions.sad,
        angry: expressions.angry,
        fearful: expressions.fearful,
        disgusted: expressions.disgusted,
        surprised: expressions.surprised,
        // Expresión dominante
        dominant: Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
        )
    };
}

/**
 * Dibujar detección facial en canvas (para debugging)
 */
function drawFaceDetection(canvas, detection) {
    if (!detection) return;

    const displaySize = { 
        width: canvas.width, 
        height: canvas.height 
    };

    faceapi.matchDimensions(canvas, displaySize);

    const resizedDetections = faceapi.resizeResults([detection], displaySize);

    // Limpiar canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar detección y landmarks
    resizedDetections.forEach((d) => {
        const box = d.detection.box;
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Dibujar landmarks
        if (d.landmarks) {
            ctx.fillStyle = '#EC4899';
            d.landmarks.positions.forEach((point) => {
                ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
            });
        }
    });
}
