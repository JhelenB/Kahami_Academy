from django.urls import path
from .views import upload_simulation, user_history, simulate

urlpatterns = [
    path("upload/", upload_simulation),
    path("history/", user_history),
    path("simulate/", simulate),
]
