// Micropigmentation Simulator
// Sprint 3 - Implementado

/**
 * Simular micropigmentación en cejas
 * 
 * @param {HTMLCanvasElement} canvas - Canvas con imagen original
 * @param {Object} facialData - Datos de características faciales detectadas
 * @param {Object} parameters - Parámetros de simulación {color, density}
 * @returns {HTMLCanvasElement} Canvas con simulación aplicada
 */
async function simulateMicropigmentation(canvas, facialData, parameters) {
    console.log('[v0] Ejecutando simulador de micropigmentación...');
    
    try {
        // Crear nuevo canvas para el resultado
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext('2d');

        // Dibujar imagen original
        const originalCtx = canvas.getContext('2d');
        const imageData = originalCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        // Aplicar filtro de micropigmentación
        applyMicropigmentationEffect(ctx, resultCanvas, facialData, parameters);

        console.log('[v0] Micropigmentación completada');
        
        // Actualizar canvas original con resultado
        canvas.getContext('2d').drawImage(resultCanvas, 0, 0);
        
        return resultCanvas;
    } catch (error) {
        console.error('[v0] Error en simulación de micropigmentación:', error);
        throw error;
    }
}

/**
 * Aplicar efecto de micropigmentación en el canvas
 */
function applyMicropigmentationEffect(ctx, canvas, facialData, parameters) {
    if (!facialData || !facialData.detectedAreas) {
        console.warn('[v0] No se detectaron cejas para micropigmentación');
        return;
    }

    const color = parameters.color || '#000000';
    const density = (parameters.density || 70) / 100;

    console.log('[v0] Aplicando micropigmentación:', { color, density });

    // Obtener datos de imagen para manipulación de píxeles
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Estimación del área de cejas basada en características faciales
    // Cejas típicamente están en el tercio superior de la cara
    const browArea = estimateBrowArea(facialData, canvas);

    if (!browArea) {
        console.warn('[v0] No se pudo estimar el área de cejas');
        return;
    }

    console.log('[v0] Área de cejas:', browArea);

    // Convertir color hex a RGB
    const rgb = hexToRgb(color);

    // Aplicar pigmentación en el área estimada
    applyPigmentationToArea(data, canvas.width, canvas.height, browArea, rgb, density);

    // Aplicar suavizado para un efecto más natural
    applySmoothingEffect(data, canvas.width, canvas.height, browArea, density * 0.3);

    // Actualizar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

    // Aplicar blend mode para efecto más realista
    ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'multiply';
    
    // Dibujar efecto de densidad con gradiente
    const gradient = ctx.createLinearGradient(browArea.x, browArea.y, browArea.x, browArea.y + browArea.height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '20');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(browArea.x, browArea.y, browArea.width, browArea.height);
    
    // Restaurar opciones de dibujo
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

/**
 * Estimar área de cejas basado en características faciales
 */
function estimateBrowArea(facialData, canvas) {
    // Si tenemos landmarks, usarlos
    if (facialData.landmarkPoints && facialData.landmarkPoints > 60) {
        // Las cejas están aproximadamente en la parte superior del rostro
        // Entre el 15% y 35% del alto desde la parte superior
        
        const faceHeight = canvas.height * 0.6; // Altura aproximada del rostro
        const topMargin = canvas.height * 0.15;
        
        return {
            x: canvas.width * 0.15,
            y: topMargin,
            width: canvas.width * 0.7,
            height: canvas.height * 0.12,
            // Dividir en área izquierda y derecha
            leftBrow: {
                x: canvas.width * 0.15,
                y: topMargin,
                width: canvas.width * 0.35,
                height: canvas.height * 0.1
            },
            rightBrow: {
                x: canvas.width * 0.5,
                y: topMargin,
                width: canvas.width * 0.35,
                height: canvas.height * 0.1
            }
        };
    }

    // Fallback: estimación general
    return {
        x: canvas.width * 0.15,
        y: canvas.height * 0.15,
        width: canvas.width * 0.7,
        height: canvas.height * 0.12,
        leftBrow: {
            x: canvas.width * 0.15,
            y: canvas.height * 0.15,
            width: canvas.width * 0.35,
            height: canvas.height * 0.1
        },
        rightBrow: {
            x: canvas.width * 0.5,
            y: canvas.height * 0.15,
            width: canvas.width * 0.35,
            height: canvas.height * 0.1
        }
    };
}

/**
 * Aplicar pigmentación a píxeles en el área especificada
 */
function applyPigmentationToArea(data, width, height, area, rgb, density) {
    const threshold = 1 - density;

    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / width);
        const col = pixelIndex % width;

        // Verificar si el píxel está en el área de cejas
        if (col >= area.x && col < area.x + area.width &&
            row >= area.y && row < area.y + area.height) {

            // Aplicar pigmentación basada en densidad
            if (Math.random() > threshold) {
                // Mezclar con el color de pigmentación
                const currentR = data[i];
                const currentG = data[i + 1];
                const currentB = data[i + 2];

                // Blend mode multiply
                data[i] = Math.round((currentR * rgb.r) / 255);
                data[i + 1] = Math.round((currentG * rgb.g) / 255);
                data[i + 2] = Math.round((currentB * rgb.b) / 255);
            }
        }
    }
}

/**
 * Aplicar suavizado para efecto natural
 */
function applySmoothingEffect(data, width, height, area, intensity) {
    const tempData = new Uint8ClampedArray(data);
    const kernelSize = 3;
    const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
    const kernelSum = 16;

    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / width);
        const col = pixelIndex % width;

        // Solo suavizar dentro del área
        if (col >= area.x && col < area.x + area.width &&
            row >= area.y && row < area.y + area.height) {

            let r = 0, g = 0, b = 0;
            let count = 0;

            // Convolución simple
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const newRow = row + ky;
                    const newCol = col + kx;

                    if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
                        const newIndex = (newRow * width + newCol) * 4;
                        const kernelValue = kernel[(ky + 1) * 3 + (kx + 1)] / kernelSum;

                        r += tempData[newIndex] * kernelValue;
                        g += tempData[newIndex + 1] * kernelValue;
                        b += tempData[newIndex + 2] * kernelValue;
                        count++;
                    }
                }
            }

            // Aplicar suavizado con intensidad controlada
            data[i] = Math.round(tempData[i] + (r - tempData[i]) * intensity);
            data[i + 1] = Math.round(tempData[i + 1] + (g - tempData[i + 1]) * intensity);
            data[i + 2] = Math.round(tempData[i + 2] + (b - tempData[i + 2]) * intensity);
        }
    }
}

/**
 * Convertir color hex a RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
