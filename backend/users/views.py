from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import User
import json


# 🔹 Crear usuario
@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido"}, status=400)

        if User.objects.filter(email=data.get("email")).exists():
            return JsonResponse({"error": "El correo ya está registrado"}, status=400)

        user = User.objects.create(
            name=data.get("name"),
            email=data.get("email"),
            password=make_password(data.get("password"))
        )

        return JsonResponse({"message": "Usuario creado", "id": user.id})

    return JsonResponse({"message": "Usa POST para crear usuario"}, status=405)


# 🔹 Listar usuarios
def list_users(request):
    users = list(User.objects.values("id", "name", "email"))  # 🔥 no mostrar password
    return JsonResponse(users, safe=False)


# 🔹 Login básico
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido"}, status=400)

        try:
            user = User.objects.get(email=data.get("email"))

            if check_password(data.get("password"), user.password):
                return JsonResponse({
                    "message": "Login exitoso",
                    "user_id": user.id,
                    "name": user.name
                })
            else:
                return JsonResponse({"error": "Contraseña incorrecta"}, status=400)

        except User.DoesNotExist:
            return JsonResponse({"error": "Usuario no existe"}, status=404)

    return JsonResponse({"message": "Usa POST para login"}, status=405)


# 🔹 Login JWT (PRO)
@csrf_exempt
def login_jwt(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido"}, status=400)

        try:
            user = User.objects.get(email=data.get("email"))

            if check_password(data.get("password"), user.password):
                refresh = RefreshToken.for_user(user)

                return JsonResponse({
                    "message": "JWT generado",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user_id": user.id,
                    "name": user.name
                })
            else:
                return JsonResponse({"error": "Contraseña incorrecta"}, status=400)

        except User.DoesNotExist:
            return JsonResponse({"error": "Usuario no existe"}, status=404)

    return JsonResponse({"message": "Usa POST para login JWT"}, status=405)


# 🔹 Ruta protegida (requiere token)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return JsonResponse({
        "message": "Acceso permitido",
        "user": str(request.user),
        "name": getattr(request.user, 'name', str(request.user)),
        "email": request.user.email,
        "id": request.user.id
    })