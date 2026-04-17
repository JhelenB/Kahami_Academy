# Guía de Despliegue - Kahami Academy

## Tabla de Contenidos
1. [Despliegue Local](#despliegue-local)
2. [Despliegue en Vercel (Frontend)](#despliegue-en-vercel-frontend)
3. [Despliegue en Render/Railway (Backend)](#despliegue-en-renderrailway-backend)
4. [Configuración de Producción](#configuración-de-producción)

## Despliegue Local

### Requisitos Previos
- Python 3.10+
- Node.js 16+ (opcional, para herramientas)
- MySQL 8.0
- Git
- Visual Studio Code (recomendado)

### Paso 1: Clonar Repositorio

```bash
git clone https://github.com/JhelenB/Kahami_Academy.git
cd Kahami_Academy
```

### Paso 2: Configurar Backend Django

```bash
cd backend

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

```env
# .env
SECRET_KEY=tu-clave-secreta-muy-larga-y-segura
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio.com

DB_NAME=kahami_academy
DB_USER=root
DB_PASSWORD=tu-password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,https://tu-dominio.com
```

```bash
# Instalar dependencias
pip install -r requirements.txt

# Crear base de datos
mysql -u root -p < ../scripts/create_db_tables.sql

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Cargar datos de cursos
python manage.py shell
>>> from apps.courses.models import Course
>>> # Los cursos ya están cargados en el script SQL

# Ejecutar servidor
python manage.py runserver 0.0.0.0:8000
```

API disponible en: `http://localhost:8000/api`
Admin disponible en: `http://localhost:8000/admin`

### Paso 3: Configurar Frontend

```bash
cd frontend

# Editar js/config.js si es necesario
# API_BASE_URL debe apuntar al backend

# Opción A: Python HTTP Server
python -m http.server 3000

# Opción B: Usando Node.js (si tienes un servidor instalado)
# npx http-server -p 3000
```

Frontend disponible en: `http://localhost:3000`

### Paso 4: Pruebas Locales

1. Abre `http://localhost:3000` en el navegador
2. Registra una nueva cuenta
3. Accede al simulador
4. Carga una foto de tu rostro
5. Selecciona un tipo de simulación
6. Ejecuta la simulación

## Despliegue en Vercel (Frontend)

### Paso 1: Preparar Repositorio

```bash
# Asegúrate de que el frontend esté en la rama correcta
git add -A
git commit -m "Frontend listo para Vercel"
git push origin main
```

### Paso 2: Conectar a Vercel

1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Haz clic en "Add New..." → "Project"
4. Selecciona tu repositorio `Kahami_Academy`
5. Configura:
   - **Root Directory**: `frontend/`
   - **Build Command**: (dejar vacío, es HTML estático)
   - **Output Directory**: `frontend/`

### Paso 3: Configurar Variables de Entorno

En Vercel Settings → Environment Variables:

```
API_BASE_URL=https://tu-backend-url.com/api
```

### Paso 4: Deploy

```bash
# Push automático a Vercel
git push origin main
```

Tu frontend estará disponible en: `https://kahami-academy.vercel.app` (o tu dominio personalizado)

## Despliegue en Render/Railway (Backend)

### Opción A: Render.com

#### Paso 1: Preparar Aplicación

```bash
# Crear Procfile
echo "web: gunicorn kahami_backend.wsgi:application" > backend/Procfile

# Crear runtime.txt
echo "python-3.10.0" > backend/runtime.txt
```

#### Paso 2: Conectar a Render

1. Ve a https://render.com
2. Haz clic en "New+" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: kahami-academy-api
   - **Root Directory**: `backend/`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn kahami_backend.wsgi:application`

#### Paso 3: Configurar Variables de Entorno

```
SECRET_KEY=tu-clave-secreta
DEBUG=False
ALLOWED_HOSTS=kahami-academy-api.onrender.com,tu-dominio.com
DB_ENGINE=django.db.backends.mysql
DB_NAME=kahami_academy
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_HOST=tu_db_host.mysql.render.com
DB_PORT=3306
CORS_ALLOWED_ORIGINS=https://kahami-academy.vercel.app,https://tu-dominio.com
```

#### Paso 4: Deploy

Push a main branch automáticamente inicia el deploy en Render.

### Opción B: Railway.app

Proceso similar a Render:

1. Conecta GitHub a Railway
2. Crea nuevo proyecto
3. Agrega variables de entorno
4. Railway auto-detectará el Procfile
5. Deploy automático en push

## Configuración de Producción

### Seguridad

```python
# backend/kahami_backend/settings.py - PRODUCCIÓN
DEBUG = False
<<<<<<< HEAD
ALLOWED_HOSTS = ['tu-dominio.com', 'www.tu-dominio.com']
=======
ALLOWED_HOSTS = ['kahami-academy.vercel.app', 
                'kahami-academy.vercel.app']
>>>>>>> c5d7108 (Guardar cambios locales antes de rebase)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
}
```

### Base de Datos en Producción

Recomendado: MySQL gerenciado (Amazon RDS, PlanetScale, etc.)

```env
DB_HOST=tu-db-host.mysql.com
DB_PORT=3306
DB_NAME=kahami_prod
DB_USER=admin
DB_PASSWORD=contraseña-fuerte-64-caracteres
```

### SSL/TLS

- Vercel: SSL automático
- Render/Railway: SSL automático
- Dominio personalizado: Usar Let's Encrypt (incluido en servicios mencionados)

### Backup de Base de Datos

```bash
# Backup manual
mysqldump -u root -p kahami_academy > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u root -p kahami_academy < backup_20240101.sql
```

### Monitoreo

1. **Vercel**: Integrated analytics
2. **Render/Railway**: Built-in logs
3. **Django**: Considerar Sentry para error tracking

```bash
pip install sentry-sdk
```

## Troubleshooting

### Error de CORS

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
<<<<<<< HEAD
    'https://tu-frontend-url.com',
=======
    "https://kahami-academy.vercel.app",
>>>>>>> c5d7108 (Guardar cambios locales antes de rebase)
    'http://localhost:3000',
]
```

### Error de Base de Datos

```bash
# Verificar conexión
python manage.py dbshell

# Ejecutar migraciones
python manage.py migrate

# Crear tablas si es necesario
mysql -u root -p kahami_academy < ../scripts/create_db_tables.sql
```

### Error de Static Files

```bash
python manage.py collectstatic --noinput
```

## Dominios Personalizados

### En Vercel

1. Settings → Domains
2. Agregar dominio personalizado
3. Actualizar registros DNS según instrucciones

### En Render/Railway

1. Settings → Custom Domain
2. Agregar dominio
3. Actualizar registros DNS (CNAME)

## CI/CD Pipeline

Archivos incluidos en `.github/workflows/`:

- `backend-deploy.yml`: Auto-deploy en push a main
- `frontend-deploy.yml`: Auto-deploy en push a main

## Contacto y Soporte

Para problemas:
1. Revisar logs en Vercel/Render
2. Revisar `settings.py` en Django
3. Verificar variables de entorno
4. Contactar: support@kahamiAcademy.com

## Recursos Útiles

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/deployment/checklist/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
