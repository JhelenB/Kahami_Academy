from django.urls import path
from . import views

app_name = 'recommendations'

urlpatterns = [
    path('', views.user_recommendations, name='list'),
    path('generate/', views.get_recommendations, name='generate'),
]
