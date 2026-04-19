import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os

# Ruta al modelo
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../face_landmarker.task')

# Inicializar modelo
try:
    BaseOptions = python.BaseOptions
    FaceLandmarker = vision.FaceLandmarker
    FaceLandmarkerOptions = vision.FaceLandmarkerOptions
    VisionRunningMode = vision.RunningMode

    options = FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=MODEL_PATH),
        running_mode=VisionRunningMode.IMAGE
    )

    landmarker = FaceLandmarker.create_from_options(options)
except Exception as e:
    print(f"⚠️ Error al cargar modelo: {e}")
    landmarker = None


def get_color(name):
    if name == "red":
        return (0, 0, 255)
    if name == "pink":
        return (180, 105, 255)
    if name == "nude":
        return (150, 120, 100)
    return (0, 0, 255)


def process_image(image_bytes, color="red"):
    """Procesa imagen y aplica maquillaje de labios con MediaPipe."""

    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return None

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if landmarker is None:
            return img

        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = landmarker.detect(mp_image)

        if not result.face_landmarks:
            return img

        landmarks = result.face_landmarks[0]
        h, w, _ = img.shape

        # 💄 ÍNDICES REALES DE LABIOS (MediaPipe completo)
        lips_idx = [
            61,146,91,181,84,17,314,405,321,375,
            291,308,324,318,402,317,14,87,178,88,
            95
        ]

        points = []
        for idx in lips_idx:
            try:
                x = int(landmarks[idx].x * w)
                y = int(landmarks[idx].y * h)
                points.append([x, y])
            except:
                pass

        if len(points) < 3:
            return img

        points = np.array(points, np.int32)
        overlay = img.copy()
        lip_color = get_color(color)

        cv2.fillPoly(overlay, [points], lip_color)
        alpha = 0.4
        img = cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0)

        return img

    except Exception as e:
        print(f"Error procesando imagen: {e}")
        return None


def get_face_shape(image_bytes):
    """Determina la forma del rostro basado en landmarks"""
    
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None or landmarker is None:
            return "Desconocida"

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = landmarker.detect(mp_image)

        if not result.face_landmarks:
            return "Desconocida"

        landmarks = result.face_landmarks[0]
        h, w, _ = img.shape

        # Puntos clave para determinar forma
        chin = landmarks[152]
        left_jaw = landmarks[234]
        right_jaw = landmarks[454]
        forehead = landmarks[10]

        chin_y = chin.y * h
        forehead_y = forehead.y * h
        jaw_width = abs((right_jaw.x - left_jaw.x) * w)
        face_height = chin_y - forehead_y

        ratio = face_height / jaw_width if jaw_width > 0 else 1

        if ratio > 1.3:
            return "Ovalado"
        elif ratio < 0.9:
            return "Redondo"
        elif abs((right_jaw.x - left_jaw.x)) < 0.1:
            return "Cuadrado"
        else:
            return "Rectangular"

    except Exception as e:
        print(f"Error detectando forma: {e}")
        return "Desconocida"