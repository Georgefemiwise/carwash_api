from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, ServiceRequestViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'service-requests', ServiceRequestViewSet, basename='service-request')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]