// Feature Analysis
// Sprint 2 - Implementado

/**
 * Analizar características faciales basadas en detección facial
 */
async function analyzeFacialFeatures(detection, canvas) {
    console.log('[v0] Analizando características faciales...');

    if (!detection) {
        return null;
    }

    try {
        // Obtener datos básicos
        const bbox = getFaceBoundingBox(detection);
        const landmarks = getFaceLandmarks(detection);
        const expressions = getFaceExpressions(detection);

        // Analizar características
        const features = {
            // Características detectadas
            faceShape: analyzeFaceShape(bbox, landmarks),
            eyeShape: analyzeEyeShape(landmarks),
            browShape: analyzeBrowShape(landmarks),
            lipShape: analyzeLipShape(landmarks),
            noseShape: analyzeNoseShape(landmarks),
            skinTone: analyzeSkinTone(canvas, bbox),
            facialSymmetry: analyzeFacialSymmetry(landmarks),
            
            // Expresión dominante
            dominantExpression: expressions.dominant,
            allExpressions: expressions,
            
            // Áreas detectadas (para recomendaciones)
            detectedAreas: [
                'cejas',      // Siempre detectables
                'ojos',       // Siempre detectables
                'nariz',      // Siempre detectable
                'labios',     // Siempre detectables
                'cara'        // Siempre detectables
            ],
            
            // Metadata
            confidence: detection.detection.score,
            boundingBox: bbox,
            landmarkPoints: landmarks.positions.length
        };

        console.log('[v0] Análisis completado:', features);
        return features;
    } catch (error) {
        console.error('[v0] Error analizando características:', error);
        return null;
    }
}

/**
 * Analizar forma del rostro
 */
function analyzeFaceShape(bbox, landmarks) {
    if (!bbox || !landmarks) return 'unknown';

    // Calcular proporción ancho/alto
    const aspectRatio = bbox.width / bbox.height;

    // Usar jawOutline para determinar forma
    const jawPoints = landmarks.jawOutline;
    if (jawPoints.length < 2) return 'unknown';

    const jawWidth = jawPoints[jawPoints.length - 1].x - jawPoints[0].x;
    const forehead = landmarks.nose[0].y;
    
    // Lógica simple de clasificación
    if (aspectRatio > 1.15) {
        return 'oblong';
    } else if (aspectRatio > 1.0) {
        return 'rectangle';
    } else if (aspectRatio > 0.85) {
        return 'oval';
    } else {
        return 'round';
    }
}

/**
 * Analizar forma de ojos
 */
function analyzeEyeShape(landmarks) {
    if (!landmarks) return 'unknown';

    const leftEye = landmarks.leftEye;
    const rightEye = landmarks.rightEye;

    if (!leftEye || !rightEye || leftEye.length < 2 || rightEye.length < 2) {
        return 'unknown';
    }

    // Calcular proporciones
    const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
    const leftEyeHeight = Math.max(...leftEye.map(p => p.y)) - Math.min(...leftEye.map(p => p.y));
    const ratio = leftEyeWidth / leftEyeHeight;

    if (ratio > 2.5) {
        return 'almond';
    } else if (ratio > 2.0) {
        return 'hooded';
    } else if (ratio > 1.5) {
        return 'round';
    } else {
        return 'downturned';
    }
}

/**
 * Analizar forma de cejas
 */
function analyzeBrowShape(landmarks) {
    if (!landmarks) return 'unknown';

    const leftBrow = landmarks.leftEyeBrow;
    const rightBrow = landmarks.rightEyeBrow;

    if (!leftBrow || !rightBrow || leftBrow.length < 2) {
        return 'unknown';
    }

    // Analizar curvatura
    const browStart = leftBrow[0].y;
    const browMiddle = leftBrow[Math.floor(leftBrow.length / 2)].y;
    const browEnd = leftBrow[leftBrow.length - 1].y;

    const curve = browStart - browMiddle + browEnd - browMiddle;

    if (curve < -5) {
        return 'curved';
    } else if (curve < 2) {
        return 'straight';
    } else {
        return 'arched';
    }
}

/**
 * Analizar forma de labios
 */
function analyzeLipShape(landmarks) {
    if (!landmarks) return 'unknown';

    const mouth = landmarks.mouth;
    if (!mouth || mouth.length < 3) return 'unknown';

    // Calcular grosor de labios
    const upperLip = mouth.slice(0, 3);
    const lowerLip = mouth.slice(3, 6);

    const upperHeight = Math.max(...upperLip.map(p => p.y)) - Math.min(...upperLip.map(p => p.y));
    const lowerHeight = Math.max(...lowerLip.map(p => p.y)) - Math.min(...lowerLip.map(p => p.y));

    const ratio = upperHeight / lowerHeight;

    if (ratio < 0.5) {
        return 'thin';
    } else if (ratio < 1.5) {
        return 'balanced';
    } else {
        return 'fuller';
    }
}

/**
 * Analizar forma de nariz
 */
function analyzeNoseShape(landmarks) {
    if (!landmarks) return 'unknown';

    const nose = landmarks.nose;
    if (!nose || nose.length < 2) return 'unknown';

    // Análisis simple basado en posición
    return 'standard'; // Implementar análisis más detallado si es necesario
}

/**
 * Analizar tono de piel (aproximado)
 */
function analyzeSkinTone(canvas, bbox) {
    if (!canvas || !bbox) return 'unknown';

    try {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(
            bbox.x + bbox.width / 4,
            bbox.y + bbox.height / 4,
            bbox.width / 2,
            bbox.height / 2
        );

        const data = imageData.data;
        let r = 0, g = 0, b = 0;

        // Promediar pixeles en el área de la mejilla
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        const samples = data.length / 4;
        r = Math.round(r / samples);
        g = Math.round(g / samples);
        b = Math.round(b / samples);

        // Clasificar tono de piel
        const lightness = (r + g + b) / 3;

        if (lightness > 200) {
            return 'very-fair';
        } else if (lightness > 180) {
            return 'fair';
        } else if (lightness > 150) {
            return 'light';
        } else if (lightness > 120) {
            return 'medium';
        } else if (lightness > 90) {
            return 'tan';
        } else {
            return 'deep';
        }
    } catch (error) {
        console.warn('[v0] Error analizando tono de piel:', error);
        return 'unknown';
    }
}

/**
 * Analizar simetría facial
 */
function analyzeFacialSymmetry(landmarks) {
    if (!landmarks) return 0;

    try {
        const leftEye = landmarks.leftEye[0];
        const rightEye = landmarks.rightEye[0];
        const nose = landmarks.nose[0];

        if (!leftEye || !rightEye || !nose) return 0;

        // Calcular desviación de simetría (0-1, donde 1 es perfecta simetría)
        const noseFromLeft = Math.abs(nose.x - leftEye.x);
        const noseFromRight = Math.abs(nose.x - rightEye.x);
        
        const symmetry = 1 - (Math.abs(noseFromLeft - noseFromRight) / (noseFromLeft + noseFromRight));
        
        return Math.max(0, Math.min(1, symmetry));
    } catch (error) {
        console.warn('[v0] Error calculando simetría:', error);
        return 0;
    }
}

/**
 * Generar perfil detallado de características para recomendaciones
 */
function generateFeatureProfile(features) {
    if (!features) {
        return null;
    }

    console.log('[v0] Generando perfil de recomendaciones...');

    const profile = {
        // Características principales
        primaryCharacteristics: {
            faceShape: features.faceShape,
            eyeShape: features.eyeShape,
            browShape: features.browShape,
            lipShape: features.lipShape,
            skinTone: features.skinTone,
            facialSymmetry: features.facialSymmetry
        },

        // Cursos recomendados basados en características
        recommendations: generateRecommendations(features),

        // Aptitud para simulaciones (qué simuladores son más aplicables)
        simulationSuitability: {
            micropigmentation: features.browShape !== 'unknown' ? 0.95 : 0.7,
            microblading: features.browShape !== 'unknown' ? 0.95 : 0.7,
            lashes: features.eyeShape !== 'unknown' ? 0.95 : 0.8,
            nails: 0.85, // Siempre disponible si hay manos
            hairColor: 0.9  // Alto potencial para todos
        },

        // Datos para análisis
        confidence: features.confidence,
        detectedAreas: features.detectedAreas
    };

    return profile;
}

/**
 * Generar recomendaciones basadas en características
 */
function generateRecommendations(features) {
    const recommendations = [];

    // Recomendaciones por forma de cejas
    if (features.browShape && features.browShape !== 'unknown') {
        recommendations.push({
            course: 'Micropigmentación Digital',
            reason: `Tu forma de cejas (${features.browShape}) es perfecta para micropigmentación`,
            priority: 'high'
        });
        recommendations.push({
            course: 'Microblading y Shading',
            reason: `Excelente candidata para microblading con tu forma de cejas`,
            priority: 'high'
        });
    }

    // Recomendaciones por forma de ojos
    if (features.eyeShape && features.eyeShape !== 'unknown') {
        recommendations.push({
            course: 'Lashista Profesional',
            reason: `Tus ojos ${features.eyeShape} lucirían espectaculares con extensiones`,
            priority: 'high'
        });
    }

    // Recomendaciones generales
    recommendations.push({
        course: 'Sistema de Uñas',
        reason: 'Complementa perfectamente con otros procedimientos estéticos',
        priority: 'medium'
    });

    return recommendations;
}
