import django_filters
from .models import Car, ServiceRequest, Transaction
from django.db.models import Q

class CarFilter(django_filters.FilterSet):
    license_plate_contains = django_filters.CharFilter(field_name='license_plate', lookup_expr='icontains')
    
    class Meta:
        model = Car
        fields = {
            'owner': ['exact'],
            'make': ['exact', 'icontains'],
            'model': ['exact', 'icontains'],
            'license_plate': ['exact'],
            'color': ['exact'],
            'created_at': ['gte', 'lte'],
        }

class ServiceRequestFilter(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name='requested_at')
    
    class Meta:
        model = ServiceRequest
        fields = {
            'status': ['exact'],
            'assigned_worker': ['exact', 'isnull'],
            'car': ['exact'],
            'car__owner': ['exact'],
            'requested_at': ['gte', 'lte'],
            'completed_at': ['gte', 'lte', 'isnull'],
            'cost': ['gte', 'lte'],
        }

class TransactionFilter(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name='timestamp')
    
    class Meta:
        model = Transaction
        fields = {
            'payment_method': ['exact'],
            'amount': ['gte', 'lte'],
            'timestamp': ['gte', 'lte'],
            'service_request': ['exact'],
            'service_request__status': ['exact'],
            'service_request__car': ['exact'],
            'service_request__car__owner': ['exact'],
        }