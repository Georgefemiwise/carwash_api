from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, ServiceRequestViewSet, ServiceTypeViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'service-requests', ServiceRequestViewSet, basename='service-request')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'service-types', ServiceTypeViewSet, basename='service-type')


urlpatterns = [
    path('', include(router.urls)),
]