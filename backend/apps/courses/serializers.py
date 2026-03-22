from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'description', 'simulator_type', 'related_services', 
                  'required_facial_features', 'enrollment_link', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
