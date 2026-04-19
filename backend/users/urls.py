from django.urls import path
from .views import create_user, list_users, login_user, login_jwt, profile

urlpatterns = [
    path('create/', create_user),
    path('list/', list_users),
    path('login/', login_user),
    path('login-jwt/', login_jwt),
    path('profile/', profile),
]
