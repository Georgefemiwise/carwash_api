from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
from .models import Car, ServiceRequest, ServiceType, Transaction
from .serializers import CarSerializer, ServiceRequestSerializer, ServiceTypeSerializer, TransactionSerializer
from .permissions import IsOwnerOrStaff, IsStaffUser

class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner', 'make', 'license_plate']
    search_fields = ['make', 'model', 'license_plate']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Car.objects.all()
        return Car.objects.filter(owner=user)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'assigned_worker', 'car__owner']
    search_fields = ['car__license_plate', 'description']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ServiceRequest.objects.all()
        return ServiceRequest.objects.filter(car__owner=user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsStaffUser])
    def assign_worker(self, request, pk=None):
        service_request = self.get_object()
        worker_id = request.data.get('worker_id')
        
        if not worker_id:
            return Response({'error': 'Worker ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from staff.models import WorkerProfile
        try:
            worker = WorkerProfile.objects.get(id=worker_id)
            service_request.assigned_worker = worker
            service_request.save()
            return Response(ServiceRequestSerializer(service_request).data)
        except WorkerProfile.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], permission_classes=[IsStaffUser])
    def update_status(self, request, pk=None):
        service_request = self.get_object()
        status_value = request.data.get('status')
        
        if status_value not in [choice[0] for choice in ServiceRequest.STATUS_CHOICES]:
            return Response({'error': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = status_value
        service_request.save()
        return Response(ServiceRequestSerializer(service_request).data)

class TransactionViewSet(viewsets.ModelViewSet):

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['payment_method', 'service_request__status']
    search_fields = ['service_request__car__license_plate']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(service_request__car__owner=user)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsStaffUser()]
        return super().get_permissions()

class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer