from rest_framework import viewsets, filters, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
# from django_filters.rest_framework import DjangoFilterBackend
from .models import WorkerProfile
from .serializers import WorkerProfileSerializer, WorkerRegistrationSerializer
from cars.permissions import IsStaffUser

class WorkerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = WorkerProfileSerializer
    permission_classes = [IsStaffUser]
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['user__full_name', 'user__email', 'phone_number']
    
    def get_queryset(self):
        # Supervisors and admins can see all workers
        user = self.request.user
        if hasattr(user, 'worker_profile'):
            if user.worker_profile.role in ['supervisor', 'admin']:
                return WorkerProfile.objects.all()
        
        # Car washers can only see themselves
        if hasattr(user, 'worker_profile'):
            return WorkerProfile.objects.filter(user=user)
        
        # No profile, return empty queryset
        return WorkerProfile.objects.none()
    
    @action(detail=False, methods=['post'], serializer_class=WorkerRegistrationSerializer)
    def register(self, request):
        # Only supervisors and admins can register new workers
        user = request.user
        if not hasattr(user, 'worker_profile') or user.worker_profile.role not in ['supervisor', 'admin']:
            return Response({'error': 'Not authorized to register workers'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = WorkerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            worker = serializer.save()
            return Response(WorkerProfileSerializer(worker).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        # Only supervisors and admins can activate/deactivate workers
        user = request.user
        if not hasattr(user, 'worker_profile') or user.worker_profile.role not in ['supervisor', 'admin']:
            return Response({'error': 'Not authorized to toggle worker status'}, status=status.HTTP_403_FORBIDDEN)
        
        worker = self.get_object()
        worker.is_active = not worker.is_active
        worker.save()
        
        return Response(WorkerProfileSerializer(worker).data)