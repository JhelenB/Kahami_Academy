from django.contrib import admin
from .models import Simulation

@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ('user', 'simulation_type', 'created_at')
    list_filter = ('simulation_type', 'created_at')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')
