// Microblading Simulator - Sprint 4 - Implementado

/**
 * Simular microblading en cejas (efecto de pelos individuales)
 */
async function simulateMicroblading(canvas, facialData, parameters) {
    console.log('[v0] Ejecutando simulador de microblading...');
    
    try {
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext('2d');

        // Dibujar imagen original
        const originalCtx = canvas.getContext('2d');
        const imageData = originalCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        // Aplicar efecto de microblading
        applyMicrobladingEffect(ctx, resultCanvas, facialData, parameters);

        canvas.getContext('2d').drawImage(resultCanvas, 0, 0);
        return resultCanvas;
    } catch (error) {
        console.error('[v0] Error en microblading:', error);
        throw error;
    }
}

/**
 * Aplicar efecto de microblading (pelos individuales)
 */
function applyMicrobladingEffect(ctx, canvas, facialData, parameters) {
    const color = parameters.color || '#2C1810';
    const lineThickness = parameters.lineThickness || 2;
    const browArea = estimateMicrobladingArea(canvas);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Dibujar pelos individuales para efecto de microblading
    drawHairStrokes(ctx, browArea.leftBrow, color, lineThickness);
    drawHairStrokes(ctx, browArea.rightBrow, color, lineThickness);

    // Aplicar efecto de sombra para profundidad
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 2;
}

/**
 * Estimar área para microblading
 */
function estimateMicrobladingArea(canvas) {
    return {
        leftBrow: {
            x: canvas.width * 0.15,
            y: canvas.height * 0.15,
            width: canvas.width * 0.35,
            height: canvas.height * 0.08
        },
        rightBrow: {
            x: canvas.width * 0.5,
            y: canvas.height * 0.15,
            width: canvas.width * 0.35,
            height: canvas.height * 0.08
        }
    };
}

/**
 * Dibujar pelos individuales
 */
function drawHairStrokes(ctx, area, color, thickness) {
    const strokeCount = Math.floor(area.width / (thickness * 2));
    
    for (let i = 0; i < strokeCount; i++) {
        const startX = area.x + (i * area.width / strokeCount);
        const startY = area.y;
        
        // Variación para efecto natural
        const angleVariation = (Math.random() - 0.5) * 30 * Math.PI / 180;
        const lengthVariation = area.height * (0.8 + Math.random() * 0.4);
        
        const endX = startX + Math.sin(angleVariation) * lengthVariation;
        const endY = startY + lengthVariation;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}
