// Nails Simulator - Sprint 4 - Implementado

/**
 * Simular diseño de uñas
 */
async function simulateNails(canvas, facialData, parameters) {
    console.log('[v0] Ejecutando simulador de uñas...');
    
    try {
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext('2d');

        const originalCtx = canvas.getContext('2d');
        const imageData = originalCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        applyNailsEffect(ctx, resultCanvas, parameters);

        canvas.getContext('2d').drawImage(resultCanvas, 0, 0);
        return resultCanvas;
    } catch (error) {
        console.error('[v0] Error en simulación de uñas:', error);
        throw error;
    }
}

/**
 * Aplicar efecto de diseño de uñas
 */
function applyNailsEffect(ctx, canvas, parameters) {
    const color = parameters.color || '#FF69B4';
    const shape = parameters.shape || 'square';
    
    // Estimar área de manos (parte inferior del canvas)
    const handArea = {
        x: canvas.width * 0.2,
        y: canvas.height * 0.65,
        width: canvas.width * 0.6,
        height: canvas.height * 0.3
    };

    // Dibujar 5 uñas (simulación)
    drawNails(ctx, handArea, color, shape);
    
    // Aplicar brillos
    applyNailShine(ctx, handArea, color);
}

/**
 * Dibujar diseño de uñas
 */
function drawNails(ctx, handArea, color, shape) {
    const nailCount = 5;
    const nailWidth = handArea.width / nailCount * 0.8;
    const nailHeight = handArea.height * 0.5;

    for (let i = 0; i < nailCount; i++) {
        const x = handArea.x + (i * handArea.width / nailCount) + nailWidth * 0.1;
        const y = handArea.y;

        drawSingleNail(ctx, x, y, nailWidth, nailHeight, color, shape);
    }
}

/**
 * Dibujar una uña individual
 */
function drawSingleNail(ctx, x, y, width, height, color, shape) {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    if (shape === 'square') {
        // Forma cuadrada
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    } else if (shape === 'oval') {
        // Forma ovalada
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + height * 0.6, width / 2, height * 0.6, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    } else if (shape === 'almond') {
        // Forma de almendra
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.bezierCurveTo(x + width, y, x + width, y + height, x + width / 2, y + height);
        ctx.bezierCurveTo(x, y + height, x, y, x + width / 2, y);
        ctx.fill();
        ctx.stroke();
    }

    // Dibujar punto de brillo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + width * 0.2, y + height * 0.15, width * 0.3, height * 0.2);
}

/**
 * Aplicar efecto de brillo en uñas
 */
function applyNailShine(ctx, handArea, color) {
    const gradient = ctx.createLinearGradient(handArea.x, handArea.y, handArea.x, handArea.y + handArea.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, color + '40');

    ctx.fillStyle = gradient;
    ctx.fillRect(handArea.x, handArea.y, handArea.width, handArea.height);
}
