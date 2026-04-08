// Performance Optimization Utilities - Sprint 8

/**
 * Lazy load modelos de face-api.js
 */
let faceLazyLoadDeferred = null;

async function lazyLoadFaceModels() {
    if (faceLazyLoadDeferred) {
        return faceLazyLoadDeferred;
    }

    faceLazyLoadDeferred = (async () => {
        console.log('[v0] Lazy loading face-api models...');
        
        // Esperar a que face-api esté disponible
        let retries = 0;
        while (typeof faceapi === 'undefined' && retries < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        if (typeof faceapi === 'undefined') {
            console.warn('[v0] face-api.js no disponible');
            return false;
        }

        return initFaceDetection();
    })();

    return faceLazyLoadDeferred;
}

/**
 * Usar Web Worker para procesamiento de imágenes (si está disponible)
 */
function supportsWebWorkers() {
    return typeof Worker !== 'undefined';
}

/**
 * Cachear resultados de análisis en localStorage
 */
const analysisCache = {
    set: (key, data) => {
        try {
            localStorage.setItem(`analysis_${key}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('[v0] Cache localStorage lleno');
        }
    },

    get: (key, maxAge = 3600000) => {
        try {
            const cached = localStorage.getItem(`analysis_${key}`);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > maxAge) {
                localStorage.removeItem(`analysis_${key}`);
                return null;
            }

            return data;
        } catch (e) {
            return null;
        }
    },

    clear: () => {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('analysis_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.warn('[v0] Error limpiando cache');
        }
    }
};

/**
 * Optimizar imagen para procesar más rápido
 */
function optimizeImageForProcessing(canvas, maxSize = 512) {
    if (canvas.width <= maxSize && canvas.height <= maxSize) {
        return canvas;
    }

    const ratio = Math.min(maxSize / canvas.width, maxSize / canvas.height);
    const newWidth = Math.round(canvas.width * ratio);
    const newHeight = Math.round(canvas.height * ratio);

    const optimized = document.createElement('canvas');
    optimized.width = newWidth;
    optimized.height = newHeight;

    const ctx = optimized.getContext('2d');
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

    console.log(`[v0] Imagen optimizada: ${canvas.width}x${canvas.height} → ${newWidth}x${newHeight}`);
    
    return optimized;
}

/**
 * Debounce para evitar llamadas repetidas
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle para limitar la frecuencia de llamadas
 */
function throttle(func, delay = 300) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

/**
 * Precargar recursos críticos
 */
function preloadCriticalResources() {
    // Precargar librerías de IA en background
    lazyLoadFaceModels();
    
    // Precargar imágenes
    const links = document.querySelectorAll('link[rel="preload"]');
    links.forEach(link => {
        if (link.as === 'image') {
            const img = new Image();
            img.src = link.href;
        }
    });

    console.log('[v0] Recursos críticos precargados');
}

/**
 * Monitorear performance
 */
const performanceMonitor = {
    marks: {},

    start: (name) => {
        performanceMonitor.marks[name] = performance.now();
    },

    end: (name) => {
        if (!performanceMonitor.marks[name]) return null;
        
        const duration = performance.now() - performanceMonitor.marks[name];
        console.log(`[v0] ${name}: ${duration.toFixed(2)}ms`);
        
        delete performanceMonitor.marks[name];
        return duration;
    }
};

/**
 * Inicializar optimizaciones al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
    // Precargar recursos si es necesario
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    } else {
        preloadCriticalResources();
    }

    // Monitorear métricas Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`[v0] Metric - ${entry.name}: ${entry.value}`);
                }
            });

            perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
        } catch (e) {
            console.warn('[v0] PerformanceObserver no disponible');
        }
    }
});
