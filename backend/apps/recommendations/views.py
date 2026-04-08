from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recommendation
from .serializers import RecommendationSerializer
from .engine import generate_recommendations

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    """Generar recomendaciones basadas en características faciales"""
    facial_features = request.data.get('facial_features', {})
    
    # Generar recomendaciones usando el motor de IA
    recommended_courses, reasoning, score = generate_recommendations(facial_features)
    
    # Guardar recomendación en BD
    recommendation = Recommendation.objects.create(
        user=request.user,
        recommended_courses=recommended_courses,
        reasoning=reasoning,
        score=score
    )
    
    serializer = RecommendationSerializer(recommendation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_recommendations(request):
    """Obtener recomendaciones del usuario"""
    recommendations = Recommendation.objects.filter(user=request.user)
    serializer = RecommendationSerializer(recommendations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
