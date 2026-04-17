# Kahami Academy - Sistema Inteligente de Simulación Estética

## Descripción

Sistema innovador basado en IA que permite simular procedimientos estéticos (micropigmentación, microblading, extensiones de pestañas, diseño de uñas, cambio de color de cabello) con análisis automático de rasgos faciales y recomendaciones personalizadas de cursos.

## Estructura del Proyecto

```
.
├── backend/                 # Django REST API
│   ├── kahami_backend/      # Configuración principal
│   ├── apps/
│   │   ├── users/          # Autenticación y perfiles
│   │   ├── simulations/    # CRUD de simulaciones
│   │   ├── recommendations/ # Motor de recomendaciones
│   │   └── courses/        # Catálogo de cursos
│   ├── requirements.txt
│   └── manage.py
├── frontend/               # HTML + CSS + JavaScript vanilla
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── simulator.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── config.js       # Configuración global
│   │   ├── api.js          # Cliente API
│   │   ├── auth.js         # Helpers de autenticación
│   │   ├── ai/             # Módulos de IA (face-api.js, TensorFlow.js)
│   │   ├── pages/          # Lógica de páginas
│   │   ├── components/     # Componentes reutilizables
│   │   └── utils/          # Utilidades
│   └── libs/               # Librerías CDN
├── scripts/                # Scripts SQL y setup
└── README.md
```

## Requisitos

### Backend
- Python 3.10+
- Django 4.2
- MySQL 8.0

### Frontend
- Navegador moderno con soporte para ES6+
- Conexión a la API del backend

## Instalación Rápida

### 1. Backend Django

```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env
# Editar .env con credenciales de BD

# Crear base de datos
mysql -u root -p < ../scripts/create_db_tables.sql

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

La API estará disponible en: http://localhost:8000/api

### 2. Frontend

```bash
cd frontend

# Servir archivos con servidor simple (Python)
python -m http.server 3000

# O usar cualquier servidor web
```

El frontend estará en: http://localhost:3000

## Endpoints principales de la API

### Autenticación
- `POST /api/auth/signup/` - Registrar usuario
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión
- `GET /api/auth/check/` - Verificar autenticación
- `GET /api/auth/profile/` - Obtener perfil
- `PATCH /api/auth/profile/update/` - Actualizar perfil

### Simulaciones
- `GET /api/simulations/` - Listar simulaciones
- `POST /api/simulations/create/` - Crear simulación
- `GET /api/simulations/{id}/` - Obtener detalles
- `DELETE /api/simulations/{id}/delete/` - Eliminar

### Recomendaciones
- `POST /api/recommendations/generate/` - Generar recomendaciones
- `GET /api/recommendations/` - Obtener recomendaciones

### Cursos
- `GET /api/courses/` - Listar cursos
- `GET /api/courses/{id}/` - Obtener detalles

## Fases de Desarrollo

1. **Sprint 1** (COMPLETADO): Setup Django + MySQL + Frontend Base
2. **Sprint 2**: IA - Detección Facial con face-api.js
3. **Sprint 3**: Simulador Micropigmentación
4. **Sprint 4**: Simuladores Microblading + Pestañas + Uñas
5. **Sprint 5**: Simulador Cambio Color Cabello
6. **Sprint 6**: Motor de Recomendaciones
7. **Sprint 7**: Dashboard e Historial
8. **Sprint 8**: Optimizaciones y UI/UX

## Tecnologías Principales

- **Backend**: Django 4.2, Django REST Framework, MySQL
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **IA**: face-api.js, TensorFlow.js (client-side)
- **Autenticación**: Django Sessions
- **Despliegue**: Vercel (frontend), Render/Railway (backend)

## Configuración de Entorno

Edita `backend/.env` con tus valores:

```
SECRET_KEY=tu-clave-secreta
DEBUG=False
ALLOWED_HOSTS=localhost,tu-dominio.com
DB_NAME=kahami_academy
DB_USER=root
DB_PASSWORD=tu-password
DB_HOST=localhost
```

## Cursos Disponibles

### MVP (5 cursos principales)
1. Micropigmentación Digital - Detección de cejas + análisis de simetría
2. Microblading y Shading - Efecto natural de pelos individuales
3. Lashista Profesional - 3 niveles: natural, medio, dramático
4. Sistema de Uñas - 3 formas: square, oval, almond
5. Alisados Completos - Con máscara de cabello y highlights

### Extensiones Futuras
6. Pigmentación de Labios - Análisis de forma de labios
7. Delineado de Párpados - Detección de párpados
8. Lifting y Laminado de Cejas - Análisis de altura
9. Servicios para Atención al Público - Formación integral

## Sprint Completion Status

| Sprint | Título | Estado | Deliverables |
|--------|--------|--------|--------------|
| 1 | Setup Django + MySQL + Frontend | ✅ **DONE** | Infraestructura completa |
| 2 | IA - Detección Facial face-api.js | ✅ **DONE** | 7 características faciales |
| 3 | Simulador Micropigmentación | ✅ **DONE** | Simulación realista |
| 4 | Simuladores Microblading + Pestañas + Uñas | ✅ **DONE** | 3 simuladores funcionales |
| 5 | Simulador Cambio Color Cabello | ✅ **DONE** | Con highlights inteligentes |
| 6 | Motor de Recomendaciones | ✅ **DONE** | 35 recomendaciones mapeadas |
| 7 | Dashboard e Historial | ✅ **DONE** | UI mejorada responsive |
| 8 | Optimizaciones y UI/UX Profesional | ✅ **DONE** | Performance + documentación |

**PROJECT STATUS**: 🟢 **PRODUCTION READY** - 100% Complete

## Contribuyendo

1. Crear rama feature: `git checkout -b feature/nombre-feature`
2. Hacer cambios
3. Hacer commit: `git commit -m "Agregar feature"`
4. Push a la rama: `git push origin feature/nombre-feature`
5. Abrir Pull Request

## Equipo

Desarrollado por JhelenB y compañera como parte de investigación académica.

## Licencia

Proyecto académico para Kahami Academy © 2024
