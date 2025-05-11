from django.db import models
from django.conf import settings
from staff.models import WorkerProfile

class Car(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cars')
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    license_plate = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['license_plate']),
            models.Index(fields=['make']),
        ]
    
    def __str__(self):
        return f"{self.make} {self.model} ({self.license_plate})"


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='service_requests')
    description = models.TextField()
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_worker = models.ForeignKey(
        WorkerProfile, 
        on_delete=models.SET_NULL, 
        related_name='service_requests',
        null=True,
        blank=True
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['car']),
            models.Index(fields=['assigned_worker']),
            models.Index(fields=['requested_at']),
        ]
    
    def __str__(self):
        return f"Service for {self.car} - {self.status}"

class Transaction(models.Model):

    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('mobile_payment', 'Mobile Payment'),
    ]
    
    service_request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name='transaction'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['payment_method']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"Transaction for {self.service_request} - {self.amount}"
    
class ServiceType(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name