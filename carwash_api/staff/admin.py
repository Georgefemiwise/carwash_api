from django.contrib import admin
from .models import WorkerProfile

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone_number', 'is_active', 'joined_date')
    list_filter = ('role', 'is_active', 'joined_date')
    search_fields = ('user__email', 'user__full_name', 'phone_number')
    date_hierarchy = 'joined_date'