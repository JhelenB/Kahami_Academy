// frontend/js/config.js

const CONFIG = {
    // ✅ CORRECCIÓN: Cambiar la URL de Render por la de tu PC local
    API_BASE_URL: 'http://127.0.0.1:8000/api', 
    
    SIMULATORS: {
        micropigmentation: {
            name: 'Micropigmentación',
            description: 'Simulación de micropigmentación de cejas'
        },
        microblading: {
            name: 'Microblading',
            description: 'Simulación de microblading de cejas'
        },
        lashes: {
            name: 'Extensiones de Pestañas',
            description: 'Simulación de extensiones de pestañas'
        },
        nails: {
            name: 'Diseño de Uñas',
            description: 'Simulación de diseño de uñas'
        },
        hairColor: {
            name: 'Color de Cabello',
            description: 'Simulación de cambio de color de cabello'
        }
    },

    COURSES: [
        { id: 1, name: 'Micropigmentación Digital', simulator: 'micropigmentation' },
        { id: 2, name: 'Microblading y Shading', simulator: 'microblading' },
        { id: 3, name: 'Lashista Profesional', simulator: 'lashes' },
        { id: 4, name: 'Sistema de Uñas', simulator: 'nails' },
        { id: 5, name: 'Alisados Completos', simulator: 'hairColor' },
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}