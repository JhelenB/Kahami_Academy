# Características Avanzadas - Kahami Academy

## Arquitectura IA Client-Side

### Por qué client-side?

- ✅ **Privacidad**: Todas las imágenes se procesan localmente
- ✅ **Rendimiento**: No hay latencia de servidor
- ✅ **Escalabilidad**: Servidor no sobrecargado con procesamiento IA
- ✅ **Costo**: Bajo uso de recursos del servidor

### Modelos Utilizados

```
face-api.js v0.0.5
├── TinyFaceDetector (rápido, preciso)
├── FaceLandmark68Net (68 puntos faciales)
├── FaceExpressionNet (expresiones)
└── FaceDescriptorNet (descriptor facial)

TensorFlow.js (runtime)
```

### Pipeline de Detección

```
Imagen del Usuario
        ↓
   face-api.js
        ↓
   TinyFaceDetector
        ↓
   Landmarks (68 puntos)
        ↓
   Análisis de Características
   ├── Forma de cejas
   ├── Forma de ojos
   ├── Forma de labios
   ├── Tono de piel
   └── Simetría facial
        ↓
   Motor de Recomendaciones
        ↓
   Lista de Cursos Personalizados
```

## Sistema de Simuladores Avanzado

### 1. Micropigmentación Digital

**Técnica**: Manipulación de píxeles con blend mode

```javascript
// Algoritmo
1. Detectar área de cejas
2. Aplicar pigmentación por píxeles
3. Variar densidad según parámetro (0-100)
4. Aplicar suavizado Gaussian (kernel 3x3)
5. Blend mode: multiply para efecto natural
```

**Parámetros**:
- Color: HEX (default: #000000)
- Densidad: 0-100 (default: 70)

### 2. Microblading

**Técnica**: Dibujo de pelos individuales

```javascript
// Características
- Pelos con curva Bezier quadratic
- Variación de ángulo (-30° a +30°)
- Grosor variable (0.8 - 1.2px)
- Alpha blending para efecto natural
```

### 3. Extensiones de Pestañas

**Técnica**: Curvas suavizadas desde línea de párpado

```javascript
// Volúmenes Disponibles
- Natural: 30 pestañas
- Medio: 50 pestañas
- Dramático: 80 pestañas

// Cálculo de longitud
baseLengthMultiplier = 1 + (lengthParam * 0.5)
actualLength = eyeAreaHeight * baseLengthMultiplier
```

### 4. Diseño de Uñas

**Técnica**: Renderizado vectorial

```
Formas disponibles:
├── Square: rectángulo puro
├── Oval: elipse
└── Almond: curva Bezier
```

### 5. Color de Cabello

**Técnica**: Colorización HSL adaptativa

```javascript
// Máscara de cabello
- 100% densidad en top 40%
- Transición suave 40-70%
- Fade en laterales

// Aplicación de color
newPixel = oldPixel * (1 - intensity) + newColor * intensity
```

## Motor de Recomendaciones

### Scoring Algorithm

```python
score = base_score
score *= detection_confidence  # 0.7-1.0
score *= feature_match_bonus   # +0.05 si match
score = min(1.0, max(0.0, score))  # Clamp [0, 1]
```

### Matriz de Recomendaciones

| Característica | Cursos Recomendados | Score Base |
|---|---|---|
| Cejas detectadas | Micropigmentación, Microblading | 0.95, 0.90 |
| Ojos detectados | Lashista, Delineado | 0.98, 0.80 |
| Manos detectadas | Sistema de Uñas | 0.92 |
| Cabello detectado | Alisados Completos | 0.85 |
| Labios detectados | Pigmentación Labios | 0.88 |

### Personalización por Características

```python
if browShape == 'arched':
    microblading_score += 0.05  # Mejor candidata
if eyeShape == 'hooded':
    lashes_score += 0.05  # Mayor impacto visual
```

## Optimizaciones de Performance

### 1. Lazy Loading

```javascript
// Face API cargado bajo demanda
await lazyLoadFaceModels()
// Se carga solo cuando se accede al simulador
```

### 2. Image Optimization

```javascript
// Redimensionar si > 512px
optimizeImageForProcessing(canvas, 512)
// Reduce tiempo de procesamiento 4x
```

### 3. Caché Local

```javascript
analysisCache.set(imageHash, analysisResult)
// Reutilizar análisis de misma foto
// TTL: 1 hora por defecto
```

### 4. Debounce/Throttle

```javascript
const optimizedAnalysis = debounce(analyzeImage, 300)
// Evitar múltiples análisis simultáneos
```

### 5. Web Workers (Futuro)

```javascript
if (supportsWebWorkers()) {
    // Procesar en thread separado
    const worker = new Worker('analyzer.worker.js')
}
```

## API Endpoints Documentados

### Autenticación

```bash
POST /api/auth/signup/
{
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
→ 201 Created

POST /api/auth/login/
{
  "username": "usuario",
  "password": "contraseña"
}
→ 200 OK, SessionID cookie

GET /api/auth/profile/
→ 200 OK
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "profile": {
    "facial_features": {...},
    "detected_characteristics": {...}
  }
}
```

### Simulaciones

```bash
GET /api/simulations/
→ 200 OK
[
  {
    "id": 1,
    "simulation_type": "micropigmentation",
    "parameters": {"color": "#000000", "density": 70},
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]

POST /api/simulations/create/
{
  "simulation_type": "microblading",
  "parameters": {"color": "#2C1810", "lineThickness": 2},
  "image_base64": "data:image/jpeg;base64,..."
}
→ 201 Created

DELETE /api/simulations/{id}/delete/
→ 204 No Content
```

### Recomendaciones

```bash
POST /api/recommendations/generate/
{
  "facial_features": {
    "faceShape": "oval",
    "eyeShape": "almond",
    "browShape": "arched",
    "skinTone": "medium",
    "detectedAreas": ["cejas", "ojos", "cara"],
    "confidence": 0.95
  }
}
→ 200 OK
{
  "recommended_courses": [3, 1, 2, 4, 5],
  "reasoning": {
    "3": {
      "name": "Lashista Profesional",
      "reason": "Ojos almond son ideales para extensiones",
      "confidence": 0.95
    },
    ...
  },
  "average_score": 0.89
}
```

## Base de Datos

### Schema Normalizado

```sql
-- Usuarios
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (hashed)
├── created_at
└── updated_at

-- Perfiles
profiles
├── id (PK)
├── user_id (FK)
├── facial_features (JSON)
├── preferred_courses (JSON)
└── created_at

-- Simulaciones
simulations
├── id (PK)
├── user_id (FK)
├── simulation_type
├── parameters (JSON)
├── image_url
├── created_at
└── updated_at

-- Recomendaciones
recommendations
├── id (PK)
├── user_id (FK)
├── course_id (FK)
├── score (0-1)
├── created_at
└── reason (TEXT)

-- Cursos
courses
├── id (PK)
├── name
├── description
├── level
├── duration_hours
└── created_at
```

## Seguridad

### Protecciones Implementadas

1. **CSRF Protection**
   - Token CSRF en formularios
   - Validación en POST/PUT/DELETE

2. **SQL Injection Prevention**
   - Queries parametrizadas (ORM Django)
   - No concatenación de strings

3. **XSS Prevention**
   - Escape de contenido HTML
   - CSP headers configurados

4. **Session Security**
   - HTTP-only cookies
   - Secure flag en HTTPS
   - SameSite=Lax

5. **Rate Limiting** (Futuro)
   ```python
   from django_ratelimit.decorators import ratelimit
   @ratelimit(key='ip', rate='10/m')
   def api_endpoint(request):
       pass
   ```

## Monitoreo y Logging

### Estructura de Logs

```javascript
// Cliente
[v0] [timestamp] [level] message: details

// Servidor
[2024-01-15 10:30:45] [INFO] User login: username
[2024-01-15 10:31:20] [ERROR] Simulation failed: error_details
```

### Métricas Core Web Vitals

```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
```

## Roadmap Futuro

### Corto Plazo (Q1 2024)
- [ ] Sistema de versioning de simulaciones
- [ ] Exportar simulaciones a PDF
- [ ] Notificaciones email
- [ ] Búsqueda avanzada de cursos

### Mediano Plazo (Q2-Q3 2024)
- [ ] Integración con sistema de pagos (Stripe)
- [ ] Sistema de reseñas de cursos
- [ ] Comunidad de usuarias (foro)
- [ ] Análisis de tendencias estéticas

### Largo Plazo (Q4 2024+)
- [ ] Modelo de IA personalizado entrenado
- [ ] AR try-on en tiempo real
- [ ] Marketplace de especialistas
- [ ] Gamification y badges
- [ ] Integración con redes sociales

## Extensibilidad

### Agregar Nuevo Simulador

1. Crear archivo `frontend/js/ai/simulators/newSimulator.js`
2. Implementar función `async function simulateNewSimulator()`
3. Agregar en `simulator.js` en switch case
4. Agregar en HTML form controls
5. Agregar en `getSimulationParameters()`

### Agregar Nuevo Curso

1. Agregar fila en `scripts/create_db_tables.sql`
2. Ejecutar migración
3. Agregar en matriz de recomendaciones
4. Agregar descripción en API

### Agregar Nueva Característica Facial

1. Crear función en `featureAnalysis.js`
2. Llamar desde `analyzeFacialFeatures()`
3. Agregar al objeto `features` retornado
4. Usar en `generateFeatureProfile()`

## Support y Mantenimiento

### Reportar Bugs

```bash
git issue create \
  --title "Bug: Descripción" \
  --body "Pasos para reproducir, resultado esperado, resultado actual"
```

### Contribuir

1. Fork repositorio
2. Crear rama: `git checkout -b feature/descripcion`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/descripcion`
5. Pull Request

### Testing

```bash
# Backend
python manage.py test apps.

# Frontend (manual en navegador)
# Abrir DevTools → Console
# [v0] logs para debugging
```

---

**Última actualización**: Sprint 8 - Marzo 2024
**Desarrollador**: JhelenB
**Licencia**: Proyecto Académico
