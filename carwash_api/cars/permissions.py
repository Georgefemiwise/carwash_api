from rest_framework import permissions

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or staff to view/edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Staff can do anything
        if request.user.is_staff:
            return True
            
        # Check if the object has an owner field that matches the requesting user
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
            
        # Check if the object has a car with an owner field
        if hasattr(obj, 'car') and hasattr(obj.car, 'owner'):
            return obj.car.owner == request.user
            
        # Check if the object has a service_request with a car with an owner field
        if hasattr(obj, 'service_request') and hasattr(obj.service_request, 'car') and hasattr(obj.service_request.car, 'owner'):
            return obj.service_request.car.owner == request.user
            
        return False

class IsStaffUser(permissions.BasePermission):
    """
    Custom permission to only allow staff members to perform actions.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff