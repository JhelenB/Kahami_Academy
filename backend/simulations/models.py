from django.db import models
from users.models import User

class Simulation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to="simulations/")
    face_shape = models.CharField(max_length=50, default="Análisis básico")
    symmetry = models.CharField(max_length=50, default="Simetría no calculada")
    makeup = models.TextField(default="Recomendaciones generales")
    hair_style = models.TextField(default="Estilos versátiles")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Simulation {self.id}"
