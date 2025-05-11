from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkerProfileViewSet

router = DefaultRouter()
router.register(r'workers', WorkerProfileViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
]