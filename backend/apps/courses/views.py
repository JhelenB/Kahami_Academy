from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Course
from .serializers import CourseSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def course_list(request):
    """Obtener lista de todos los cursos"""
    simulator_type = request.query_params.get('simulator_type', None)
    
    if simulator_type:
        courses = Course.objects.filter(simulator_type=simulator_type)
    else:
        courses = Course.objects.all()
    
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail(request, pk):
    """Obtener detalles de un curso"""
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    serializer = CourseSerializer(course)
    return Response(serializer.data, status=status.HTTP_200_OK)
