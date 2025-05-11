from django.db import models
from django.conf import settings

class WorkerProfile(models.Model):
    ROLE_CHOICES = [
        ('car_washer', 'Car Washer'),
        ('supervisor', 'Supervisor'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='worker_profile'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='car_washer')
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    joined_date = models.DateField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.full_name} - {self.get_role_display()}"