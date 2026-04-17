from django.db import models
from django.contrib.auth.models import User
from django.core.validators import EmailValidator
import json

class UserProfile(models.Model):
    """Perfil extendido del usuario con características faciales"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    facial_features = models.JSONField(default=dict, blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
