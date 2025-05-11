from django.contrib import admin
from .models import Car, ServiceRequest, ServiceType, Transaction

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('license_plate', 'make', 'model', 'color', 'owner', 'created_at')
    list_filter = ('make', 'created_at')
    search_fields = ('license_plate', 'make', 'model', 'owner__email')
    date_hierarchy = 'created_at'

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'car', 'status', 'assigned_worker', 'requested_at', 'completed_at', 'cost')
    list_filter = ('status', 'requested_at')
    search_fields = ('car__license_plate', 'description', 'car__owner__email')
    date_hierarchy = 'requested_at'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'service_request', 'amount', 'payment_method', 'timestamp')
    list_filter = ('payment_method', 'timestamp')
    search_fields = ('service_request__car__license_plate', 'service_request__car__owner__email')
    date_hierarchy = 'timestamp'


@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration_minutes', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at', 'updated_at')