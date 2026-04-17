from rest_framework import serializers
from .models import Recommendation

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ('id', 'recommended_courses', 'reasoning', 'score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
