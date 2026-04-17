from django.urls import path
from .views import (
    simulation_list,
    create_simulation,
    simulation_detail,
    delete_simulation,
    simular
)

urlpatterns = [
    path('simulations/', simulation_list),
    path('simulations/create/', create_simulation),
    path('simulations/<int:pk>/', simulation_detail),
    path('simulations/delete/<int:pk>/', delete_simulation),

    # 🔥 ESTE ES EL IMPORTANTE
    path('simular/', simular),
]