from rest_framework import serializers
from .models import Simulation

class SimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Simulation
        fields = ('id', 'simulation_type', 'original_image_url', 'result_image_url', 
                  'parameters', 'facial_features', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
