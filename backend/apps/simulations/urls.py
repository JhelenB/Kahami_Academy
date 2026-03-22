from django.urls import path
from . import views

app_name = 'simulations'

urlpatterns = [
    path('', views.simulation_list, name='list'),
    path('create/', views.create_simulation, name='create'),
    path('<int:pk>/', views.simulation_detail, name='detail'),
    path('<int:pk>/delete/', views.delete_simulation, name='delete'),
]
