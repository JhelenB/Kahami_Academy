from django.db import models

class Course(models.Model):
    SIMULATOR_TYPES = [
        ('micropigmentation', 'Micropigmentación'),
        ('microblading', 'Microblading'),
        ('lashes', 'Extensiones de Pestañas'),
        ('nails', 'Diseño de Uñas'),
        ('hairColor', 'Cambio de Color de Cabello'),
        ('lips', 'Pigmentación de Labios'),
        ('eyeliner', 'Delineado de Párpados'),
        ('browLifting', 'Lifting y Laminado de Cejas'),
        ('general', 'General'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    simulator_type = models.CharField(max_length=50, choices=SIMULATOR_TYPES)
    related_services = models.JSONField(default=list, blank=True)
    required_facial_features = models.JSONField(default=dict, blank=True)
    enrollment_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['name']
        indexes = [models.Index(fields=['simulator_type'])]

    def __str__(self):
        return self.name
