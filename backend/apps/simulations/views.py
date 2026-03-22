from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Simulation
from .serializers import SimulationSerializer

class SimulationViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de simulaciones"""
    serializer_class = SimulationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Mostrar solo simulaciones del usuario autenticado"""
        return Simulation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Crear simulación asociada al usuario"""
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def simulation_list(request):
    """Obtener todas las simulaciones del usuario"""
    simulations = Simulation.objects.filter(user=request.user)
    serializer = SimulationSerializer(simulations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_simulation(request):
    """Crear nueva simulación"""
    serializer = SimulationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def simulation_detail(request, pk):
    """Obtener detalles de una simulación"""
    try:
        simulation = Simulation.objects.get(pk=pk, user=request.user)
    except Simulation.DoesNotExist:
        return Response({'error': 'Simulación no encontrada'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    serializer = SimulationSerializer(simulation)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_simulation(request, pk):
    """Eliminar una simulación"""
    try:
        simulation = Simulation.objects.get(pk=pk, user=request.user)
    except Simulation.DoesNotExist:
        return Response({'error': 'Simulación no encontrada'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    simulation.delete()
    return Response({'message': 'Simulación eliminada'}, 
                   status=status.HTTP_204_NO_CONTENT)
