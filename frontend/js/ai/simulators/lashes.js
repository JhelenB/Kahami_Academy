// Lashes Simulator - Sprint 4 - Implementado

/**
 * Simular extensiones de pestañas
 */
async function simulateLashes(canvas, facialData, parameters) {
    console.log('[v0] Ejecutando simulador de pestañas...');
    
    try {
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext('2d');

        const originalCtx = canvas.getContext('2d');
        const imageData = originalCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        applyLashesEffect(ctx, resultCanvas, facialData, parameters);

        canvas.getContext('2d').drawImage(resultCanvas, 0, 0);
        return resultCanvas;
    } catch (error) {
        console.error('[v0] Error en simulación de pestañas:', error);
        throw error;
    }
}

/**
 * Aplicar efecto de extensiones de pestañas
 */
function applyLashesEffect(ctx, canvas, facialData, parameters) {
    const length = (parameters.length || 50) / 100;
    const volume = parameters.volume || 'natural';
    const eyeAreas = estimateEyeAreas(canvas);

    // Aplicar a ojo izquierdo
    drawLashes(ctx, eyeAreas.leftEye, length, volume);
    
    // Aplicar a ojo derecho
    drawLashes(ctx, eyeAreas.rightEye, length, volume);

    console.log('[v0] Pestañas aplicadas:', { length, volume });
}

/**
 * Estimar áreas de los ojos
 */
function estimateEyeAreas(canvas) {
    const eyeHeight = canvas.height * 0.08;
    const eyeWidth = canvas.height * 0.12;

    return {
        leftEye: {
            x: canvas.width * 0.25,
            y: canvas.height * 0.2,
            width: eyeWidth,
            height: eyeHeight,
            bottomY: canvas.height * 0.2 + eyeHeight
        },
        rightEye: {
            x: canvas.width * 0.63,
            y: canvas.height * 0.2,
            width: eyeWidth,
            height: eyeHeight,
            bottomY: canvas.height * 0.2 + eyeHeight
        }
    };
}

/**
 * Dibujar pestañas
 */
function drawLashes(ctx, eyeArea, lengthMultiplier, volume) {
    const lashCount = volume === 'natural' ? 30 : volume === 'medium' ? 50 : 80;
    const lashLength = eyeArea.height * (1 + lengthMultiplier * 0.5);

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < lashCount; i++) {
        const x = eyeArea.x + (i / lashCount) * eyeArea.width;
        const startY = eyeArea.bottomY;

        // Calcular ángulo de la pestaña
        const angleVariation = (Math.random() - 0.5) * 40 * Math.PI / 180;
        const angle = -Math.PI / 2 + angleVariation;

        const endX = x + Math.cos(angle) * lashLength;
        const endY = startY + Math.sin(angle) * lashLength;

        // Dibujar con grosor variable
        ctx.lineWidth = 0.8 + Math.random() * 0.4;
        ctx.globalAlpha = 0.7 + Math.random() * 0.3;

        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.quadraticCurveTo(
            x + Math.random() * 2,
            startY + lashLength * 0.5,
            endX,
            endY
        );
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}
