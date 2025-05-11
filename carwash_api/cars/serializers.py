from rest_framework import serializers
from .models import Car, ServiceRequest, ServiceType, Transaction
from staff.serializers import WorkerProfileSerializer

class CarSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    
    class Meta:
        model = Car
        fields = ('id', 'owner', 'owner_email', 'make', 'model', 'license_plate', 'color', 'created_at')
        read_only_fields = ('id', 'owner', 'created_at', 'owner_email')
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class ServiceRequestSerializer(serializers.ModelSerializer):
    car_details = CarSerializer(source='car', read_only=True)
    assigned_worker_details = WorkerProfileSerializer(source='assigned_worker', read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = ('id', 'car', 'car_details', 'description', 'requested_at', 'status', 
                  'assigned_worker', 'assigned_worker_details', 'completed_at', 'cost')
        read_only_fields = ('id', 'requested_at', 'completed_at', 'car_details', 'assigned_worker_details')

class TransactionSerializer(serializers.ModelSerializer):
    service_request_details = ServiceRequestSerializer(source='service_request', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ('id', 'service_request', 'service_request_details', 'amount', 'payment_method', 'timestamp')
        read_only_fields = ('id', 'timestamp', 'service_request_details')


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = '__all__'