// Hair Color Simulator - Sprint 5 - Implementado

/**
 * Simular cambio de color de cabello
 */
async function simulateHairColor(canvas, facialData, parameters) {
    console.log('[v0] Ejecutando simulador de color de cabello...');
    
    try {
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext('2d');

        const originalCtx = canvas.getContext('2d');
        const imageData = originalCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        applyHairColorEffect(ctx, resultCanvas, parameters);

        canvas.getContext('2d').drawImage(resultCanvas, 0, 0);
        return resultCanvas;
    } catch (error) {
        console.error('[v0] Error en simulación de color:', error);
        throw error;
    }
}

/**
 * Aplicar cambio de color de cabello al canvas
 */
function applyHairColorEffect(ctx, canvas, parameters) {
    const newColor = parameters.color || '#8B4513';
    const intensity = (parameters.intensity || 70) / 100;

    console.log('[v0] Aplicando color de cabello:', { newColor, intensity });

    // Obtener datos de imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Estimar área de cabello (parte superior y laterales del canvas)
    const hairMask = generateHairMask(canvas.width, canvas.height);

    // Convertir color hex a RGB
    const targetRgb = hexToRgb(newColor);

    // Procesar cada píxel
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / canvas.width);
        const col = pixelIndex % canvas.width;

        // Verificar si el píxel está en el área de cabello
        if (hairMask[pixelIndex] > 0) {
            const maskValue = hairMask[pixelIndex] / 255;

            // Detectar si es un píxel de cabello (oscuro)
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

            // Los píxeles de cabello suelen ser más oscuros
            if (brightness < 200) {
                // Aplicar colorización
                const currentR = data[i];
                const currentG = data[i + 1];
                const currentB = data[i + 2];

                // Mezclar con el nuevo color
                const blendStrength = maskValue * intensity;
                
                data[i] = Math.round(currentR * (1 - blendStrength) + targetRgb.r * blendStrength);
                data[i + 1] = Math.round(currentG * (1 - blendStrength) + targetRgb.g * blendStrength);
                data[i + 2] = Math.round(currentB * (1 - blendStrength) + targetRgb.b * blendStrength);
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Aplicar efecto de brillo/highlight
    applyHairHighlights(ctx, canvas, targetRgb, intensity * 0.3);
}

/**
 * Generar máscara de área de cabello
 */
function generateHairMask(width, height) {
    const mask = new Uint8ClampedArray(width * height);

    // Llenar el área de cabello (parte superior ~40% del canvas)
    for (let y = 0; y < height * 0.4; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = y * width + x;
            
            // Crear transición suave
            const intensity = Math.max(0, 255 * (1 - y / (height * 0.4)));
            mask[pixelIndex] = Math.floor(intensity);
        }
    }

    // Agregar áreas laterales (cabello a los lados)
    for (let y = height * 0.4; y < height * 0.7; y++) {
        // Lado izquierdo
        for (let x = 0; x < width * 0.2; x++) {
            const pixelIndex = y * width + x;
            const distance = x / (width * 0.2);
            mask[pixelIndex] = Math.floor(150 * (1 - distance));
        }

        // Lado derecho
        for (let x = width * 0.8; x < width; x++) {
            const pixelIndex = y * width + x;
            const distance = (x - width * 0.8) / (width * 0.2);
            mask[pixelIndex] = Math.floor(150 * distance);
        }
    }

    return mask;
}

/**
 * Aplicar highlights/luces en el cabello
 */
function applyHairHighlights(ctx, canvas, baseColor, intensity) {
    if (intensity < 0.1) return;

    // Crear gradiente de iluminación
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.3);
    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + intensity * 0.4 + ')');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, ' + intensity * 0.15 + ')');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);
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
    } : { r: 139, g: 69, b: 19 }; // Brown por defecto
}
