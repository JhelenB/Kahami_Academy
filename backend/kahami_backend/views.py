from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Kahami API funcionando"})
