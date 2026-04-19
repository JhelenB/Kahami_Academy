from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = None  # ❌ eliminamos username
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.email