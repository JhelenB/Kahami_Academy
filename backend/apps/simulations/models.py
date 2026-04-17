from django.db import models
from django.contrib.auth.models import User

class Simulation(models.Model):
    SIMULATION_TYPES = [
        ('micropigmentation', 'Micropigmentación'),
        ('microblading', 'Microblading'),
        ('lashes', 'Extensiones de Pestañas'),
        ('nails', 'Diseño de Uñas'),
        ('hairColor', 'Cambio de Color de Cabello'),
        ('lips', 'Pigmentación de Labios'),
        ('eyeliner', 'Delineado de Párpados'),
        ('browLifting', 'Lifting y Laminado de Cejas'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='simulations')
    simulation_type = models.CharField(max_length=50, choices=SIMULATION_TYPES)
    original_image_url = models.ImageField(upload_to='simulations/original/', null=True, blank=True)
    result_image_url = models.ImageField(upload_to='simulations/results/', null=True, blank=True)
    parameters = models.JSONField(default=dict, blank=True)
    facial_features = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'simulations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['simulation_type']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.get_simulation_type_display()}"
