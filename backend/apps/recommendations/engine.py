"""
Motor de recomendaciones basado en características faciales detectadas
Sprint 6 - Optimizado
"""

def generate_recommendations(facial_features):
    """
    Generar recomendaciones personalizadas basadas en características faciales
    
    Args:
        facial_features: Dict con características detectadas por IA en cliente
        Estructura esperada:
        {
            'faceShape': 'oval',
            'eyeShape': 'almond',
            'browShape': 'arched',
            'skinTone': 'medium',
            'detectedAreas': ['cejas', 'ojos', 'cara'],
            'confidence': 0.95,
            ...
        }
        
    Returns:
        tuple: (recommended_courses, reasoning, score)
    """
    
    recommended_courses = []
    reasoning = {}
    scores = {}
    
    # Obtener características
    detected_areas = facial_features.get('detectedAreas', [])
    brow_shape = facial_features.get('browShape', None)
    eye_shape = facial_features.get('eyeShape', None)
    skin_tone = facial_features.get('skinTone', None)
    confidence = facial_features.get('confidence', 0.5)
    
    # Matriz de recomendaciones mejorada
    recommendations_db = {
        # Recomendaciones por área
        'cejas': [
            {
                'course_id': 1,
                'name': 'Micropigmentación Digital',
                'score': 0.95,
                'reason': 'Especialización en micropigmentación de cejas con técnicas digitales',
                'target_features': ['arched', 'curved'],
            },
            {
                'course_id': 2,
                'name': 'Microblading y Shading',
                'score': 0.90,
                'reason': 'Técnica de microblading para efecto de pelos individuales',
                'target_features': ['straight', 'arched'],
            },
        ],
        'ojos': [
            {
                'course_id': 3,
                'name': 'Lashista Profesional',
                'score': 0.98,
                'reason': 'Extensiones de pestañas profesionales para realzar la mirada',
                'target_features': ['almond', 'hooded'],
            },
            {
                'course_id': 7,
                'name': 'Delineado de Párpados',
                'score': 0.80,
                'reason': 'Delineado permanente para definir ojos',
                'target_features': None,
            },
        ],
        'manos': [
            {
                'course_id': 4,
                'name': 'Sistema de Uñas',
                'score': 0.92,
                'reason': 'Diseño y aplicación de sistemas de uñas',
                'target_features': None,
            },
        ],
        'cara': [
            {
                'course_id': 5,
                'name': 'Alisados Completos',
                'score': 0.85,
                'reason': 'Alisados y tratamientos capilares para transformación integral',
                'target_features': None,
            },
        ],
        'labios': [
            {
                'course_id': 6,
                'name': 'Pigmentación de Labios',
                'score': 0.88,
                'reason': 'Pigmentación semi-permanente de labios',
                'target_features': ['fuller', 'balanced'],
            },
        ],
    }
    
    # Generar recomendaciones basadas en áreas detectadas
    for area in detected_areas:
        if area in recommendations_db:
            for rec in recommendations_db[area]:
                course_id = rec['course_id']
                
                # Calcular score basado en características específicas
                score = rec['score']
                
                # Ajuste de score según características
                if rec['target_features']:
                    if area == 'cejas' and brow_shape in rec['target_features']:
                        score = min(1.0, score + 0.05)
                    elif area == 'ojos' and eye_shape in rec['target_features']:
                        score = min(1.0, score + 0.05)
                
                # Ajuste por confianza de detección
                score = score * (0.7 + confidence * 0.3)
                
                # Evitar duplicados
                if course_id not in scores or score > scores[course_id]:
                    scores[course_id] = score
                    reasoning[course_id] = {
                        'name': rec['name'],
                        'reason': rec['reason'],
                        'area': area,
                        'confidence': confidence
                    }
    
    # Si no hay recomendaciones, sugerir cursos fundamentales
    if not scores:
        default_recommendations = {
            1: {'name': 'Micropigmentación Digital', 'score': 0.80, 'reason': 'Curso fundamental en estética profesional'},
            2: {'name': 'Microblading y Shading', 'score': 0.78, 'reason': 'Especialidad en alto demanda'},
            3: {'name': 'Lashista Profesional', 'score': 0.85, 'reason': 'Técnica muy solicitada en servicios estéticos'},
            4: {'name': 'Sistema de Uñas', 'score': 0.75, 'reason': 'Base importante para servicios integrales'},
            5: {'name': 'Alisados Completos', 'score': 0.72, 'reason': 'Servicio complementario popular'},
        }
        scores = default_recommendations
        for course_id, rec in default_recommendations.items():
            reasoning[course_id] = {
                'name': rec['name'],
                'reason': rec['reason'],
                'area': 'general',
                'confidence': 0.5
            }
    
    # Ordenar por score y crear lista de cursos recomendados
    recommended_courses = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
    
    # Calcular score promedio ponderado
    if recommended_courses:
        total_score = sum(scores.values())
        average_score = total_score / len(recommended_courses)
    else:
        average_score = 0.5
    
    return recommended_courses, reasoning, average_score
