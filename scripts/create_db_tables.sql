-- Script para crear base de datos y usuario MySQL
CREATE DATABASE IF NOT EXISTS kahami_academy;
USE kahami_academy;

-- Tabla usuarios (Django auth_user)
CREATE TABLE IF NOT EXISTS auth_user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  last_login DATETIME NULL,
  is_superuser BOOLEAN DEFAULT FALSE,
  username VARCHAR(150) UNIQUE NOT NULL,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  email VARCHAR(254),
  is_staff BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  date_joined DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  facial_features JSON,
  preferences JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla simulaciones
CREATE TABLE IF NOT EXISTS simulations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  simulation_type VARCHAR(50),
  original_image_url VARCHAR(255),
  result_image_url VARCHAR(255),
  parameters JSON,
  facial_features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_simulation_type (simulation_type)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla recomendaciones
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recommended_courses JSON,
  reasoning JSON,
  score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla cursos
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  simulator_type VARCHAR(50),
  related_services JSON,
  required_facial_features JSON,
  enrollment_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_simulator_type (simulator_type)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertar cursos iniciales
INSERT INTO courses (name, simulator_type, related_services, required_facial_features) VALUES
('Micropigmentación Digital', 'micropigmentation', '["Micropigmentación Digital", "Estilista de la mirada"]', '{"targetArea": "cejas"}'),
('Microblading y Shading', 'microblading', '["Microblading y Shading", "Microblading de cejas"]', '{"targetArea": "cejas"}'),
('Lashista Profesional', 'lashes', '["Extensiones de pestañas", "Lashista profesional"]', '{"targetArea": "ojos"}'),
('Sistema de Uñas', 'nails', '["Sistema de uñas", "Uñas acrílicas"]', '{"targetArea": "manos"}'),
('Alisados Completos', 'hairColor', '["Alisados completos", "Alisados y tratamientos"]', '{"targetArea": "cabello"}'),
('Pigmentación de Labios', 'lips', '["Pigmentación de Labios"]', '{"targetArea": "labios"}'),
('Delineado de Párpados', 'eyeliner', '["Delineado de párpados", "Estilista de la mirada"]', '{"targetArea": "párpados"}'),
('Lifting y Laminado de Cejas', 'browLifting', '["Lifting y laminado de cejas"]', '{"targetArea": "cejas"}'),
('Servicios para Atención al Público', 'general', '["Servicios para atención al público"]', NULL);
