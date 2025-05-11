from rest_framework import serializers
from .models import WorkerProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class WorkerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name')
        read_only_fields = ('id',)

class WorkerProfileSerializer(serializers.ModelSerializer):
    user_details = WorkerUserSerializer(source='user', read_only=True)
    
    class Meta:
        model = WorkerProfile
        fields = ('id', 'user', 'user_details', 'role', 'phone_number', 'is_active', 'joined_date')
        read_only_fields = ('id', 'joined_date', 'user_details')

class WorkerRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=WorkerProfile.ROLE_CHOICES, required=True)
    phone_number = serializers.CharField(required=True)
    
    def create(self, validated_data):
        user_data = {
            'email': validated_data.pop('email'),
            'full_name': validated_data.pop('full_name'),
            'password': validated_data.pop('password'),
            'is_staff': True  # All workers should have staff status
        }
        
        user = User.objects.create_user(**user_data)
        worker_profile = WorkerProfile.objects.create(user=user, **validated_data)
        
        return worker_profile