from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Simulation
from .ai_processor import process_image, get_face_shape

import cv2
import numpy as np
import base64


def get_face_mesh():
    try:
        import mediapipe as mp
        mp_face_mesh = mp.solutions.face_mesh
        return mp_face_mesh.FaceMesh(static_image_mode=True)
    except (ImportError, AttributeError):
        return None

face_mesh = get_face_mesh()

def analyze_face(face, w, h):
    left_eye = face.landmark[33]
    right_eye = face.landmark[263]
    chin = face.landmark[152]
    forehead = face.landmark[10]
    mouth_left = face.landmark[61]
    mouth_right = face.landmark[291]

    eye_distance = abs(right_eye.x - left_eye.x) * w
    face_height = abs(chin.y - forehead.y) * h
    mouth_width = abs(mouth_right.x - mouth_left.x) * w

    face_ratio = eye_distance / face_height
    symmetry_ratio = eye_distance / (mouth_width + 1)

    # 🔥 forma de rostro
    if face_ratio > 0.9:
        face_shape = "Rostro redondo"
        makeup = "Contorno facial + labios definidos"
        hair = "Peinados verticales"
    elif 0.75 <= face_ratio <= 0.9:
        face_shape = "Rostro ovalado"
        makeup = "Estilo natural equilibrado"
        hair = "Cualquier estilo"
    else:
        face_shape = "Rostro alargado"
        makeup = "Sombras suaves + volumen lateral"
        hair = "Flequillo recomendado"

    # 🔥 simetría
    if symmetry_ratio > 1.5:
        symmetry = "Alta simetría"
    elif symmetry_ratio > 1.2:
        symmetry = "Simetría media"
    else:
        symmetry = "Simetría baja"

    return {
        "face_shape": face_shape,
        "symmetry": symmetry,
        "makeup": makeup,
        "hair_style": hair,
        "metrics": {
            "face_ratio": float(face_ratio),
            "symmetry_ratio": float(symmetry_ratio)
        }
    }


@csrf_exempt
def upload_simulation(request):
    if request.method == "POST":
        image_file = request.FILES.get("image")

        if face_mesh is None:
            # Fallback cuando MediaPipe no está disponible
            return JsonResponse({
                "status": "success",
                "analysis": {
                    "face_shape": "Análisis básico",
                    "symmetry": "Simetría no calculada",
                    "makeup": "Recomendaciones generales",
                    "hair_style": "Estilos versátiles",
                    "metrics": {
                        "face_ratio": 0.0,
                        "symmetry_ratio": 0.0
                    }
                }
            })

        file_bytes = np.asarray(bytearray(image_file.read()), dtype=np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            return JsonResponse({
                "error": "No se detectó rostro claramente"
            })

        face = results.multi_face_landmarks[0]
        h, w, _ = img.shape

        analysis = analyze_face(face, w, h)

        user = request.user if request.user.is_authenticated else None

        Simulation.objects.create(
            user=user,
            image=image_file,
            face_shape=analysis["face_shape"],
            symmetry=analysis["symmetry"],
            makeup=analysis["makeup"],
            hair_style=analysis["hair_style"]
        )

        return JsonResponse({
            "status": "success",
            "analysis": analysis
        })

    return JsonResponse({"error": "Método no permitido"}, status=405)


def user_history(request):
    user_id = request.GET.get("user_id")

    data = Simulation.objects.filter(user_id=user_id).values(
        "face_shape",
        "symmetry",
        "makeup",
        "hair_style",
        "created_at"
    )

    return JsonResponse(list(data), safe=False)


@csrf_exempt
def simulate(request):
    """Procesa imagen con IA y devuelve imagen modificada"""
    if request.method == "POST":
        image_file = request.FILES.get("image")
        color = request.POST.get("color", "red")

        if not image_file:
            return JsonResponse({"error": "No image provided"}, status=400)

        try:
            # Procesar con IA
            processed_img = process_image(image_file.read(), color)

            if processed_img is None:
                return JsonResponse({"error": "Error procesando imagen"}, status=500)

            # Convertir a base64
            _, buffer = cv2.imencode('.jpg', processed_img)
            img_base64 = base64.b64encode(buffer).decode('utf-8')

            return JsonResponse({
                "status": "success",
                "image": img_base64
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)
