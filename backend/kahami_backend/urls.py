from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("🚀 Kahami Academy está funcionando")

urlpatterns = [
    path('', home),  # 👈 Ruta principal
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/simulations/', include('apps.simulations.urls')),
    path('api/recommendations/', include('apps.recommendations.urls')),
    path('api/courses/', include('apps.courses.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)