from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authentication.models import User
from staff.models import WorkerProfile

class StaffTests(APITestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            full_name='Admin User',
            password='securepassword',
            is_staff=True
        )
        
        # Create admin profile
        self.admin_profile = WorkerProfile.objects.create(
            user=self.admin_user,
            role='admin',
            phone_number='555-123-4567'
        )
        
        # Create car washer user
        self.washer_user = User.objects.create_user(
            email='washer@example.com',
            full_name='Washer User',
            password='securepassword',
            is_staff=True
        )
        
        # Create washer profile
        self.washer_profile = WorkerProfile.objects.create(
            user=self.washer_user,
            role='car_washer',
            phone_number='555-987-6543'
        )
        
        # Create regular customer
        self.customer = User.objects.create_user(
            email='customer@example.com',
            full_name='Customer User',
            password='securepassword'
        )
    
    def test_worker_list_as_admin(self):
        """
        Test worker listing as admin (should see all workers)
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('worker-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_worker_list_as_washer(self):
        """
        Test worker listing as car washer (should only see self)
        """
        self.client.force_authenticate(user=self.washer_user)
        url = reverse('worker-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user'], self.washer_user.id)
    
    def test_worker_list_as_customer(self):
        """
        Test worker listing as customer (should be forbidden)
        """
        self.client.force_authenticate(user=self.customer)
        url = reverse('worker-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_worker_register(self):
        """
        Test worker registration (admin only)
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('worker-register')
        data = {
            'email': 'newworker@example.com',
            'full_name': 'New Worker',
            'password': 'securepassword',
            'role': 'car_washer',
            'phone_number': '123-456-7890'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WorkerProfile.objects.count(), 3)
        self.assertEqual(User.objects.filter(is_staff=True).count(), 3)
        
        # Test car washer cannot register workers
        self.client.force_authenticate(user=self.washer_user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_toggle_active(self):
        """
        Test toggling worker active status
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('worker-toggle-active', args=[self.washer_profile.id])
        
        # Initially active
        self.assertTrue(self.washer_profile.is_active)
        
        # Toggle to inactive
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh from db
        self.washer_profile.refresh_from_db()
        self.assertFalse(self.washer_profile.is_active)
        
        # Toggle back to active
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh from db
        self.washer_profile.refresh_from_db()
        self.assertTrue(self.washer_profile.is_active)