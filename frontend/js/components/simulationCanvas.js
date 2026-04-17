// Simulation Canvas Component
// Sprint 2-3

/**
 * Inicializar canvas para simulación
 */
function initSimulationCanvas(canvasElement, width, height) {
    canvasElement.width = width;
    canvasElement.height = height;
    return canvasElement.getContext('2d');
}

/**
 * Dibujar imagen base en canvas
 */
function drawBaseImage(ctx, image, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

/**
 * Exportar canvas a imagen
 */
function exportCanvasImage(canvas) {
    return canvas.toDataURL('image/png');
}
