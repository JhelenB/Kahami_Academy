from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Simulation
from .serializers import SimulationSerializer

# =========================
# VIEWSET (CRUD COMPLETO)
# =========================
class SimulationViewSet(viewsets.ModelViewSet):
    serializer_class = SimulationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Simulation.objects.all()

    def perform_create(self, serializer):
        serializer.save()


# =========================
# LISTAR SIMULACIONES
# =========================
@api_view(['GET'])
@permission_classes([AllowAny])
def simulation_list(request):
    simulations = Simulation.objects.all()
    serializer = SimulationSerializer(simulations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# =========================
# CREAR SIMULACIÓN
# =========================
@api_view(['POST'])
@permission_classes([AllowAny])
def create_simulation(request):
    serializer = SimulationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# DETALLE
# =========================
@api_view(['GET'])
@permission_classes([AllowAny])
def simulation_detail(request, pk):
    try:
        simulation = Simulation.objects.get(pk=pk)
    except Simulation.DoesNotExist:
        return Response({'error': 'Simulación no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SimulationSerializer(simulation)
    return Response(serializer.data)


# =========================
# ELIMINAR
# =========================
@api_view(['DELETE'])
@permission_classes([AllowAny])
def simulation_delete(request, pk):
    try:
        simulation = Simulation.objects.get(pk=pk)
    except Simulation.DoesNotExist:
        return Response({'error': 'Simulación no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    simulation.delete()
    return Response({'message': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)


# =========================
# 🔥 SIMULADOR (CLAVE)
# =========================
@api_view(['POST'])
@permission_classes([AllowAny])
def simular(request):
    """
    Endpoint principal para el botón de simulación
    """
    return Response({
        "status": "ok",
        "mensaje": "Simulación ejecutada correctamente",
        "imagen_resultado": "https://via.placeholder.com/400"
    })