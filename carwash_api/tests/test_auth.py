from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authentication.models import User

class AuthTests(APITestCase):
    def test_user_registration(self):
        """
        Test user registration endpoint
        """
        url = reverse('register')
        data = {
            'email': 'test@example.com',
            'full_name': 'Test User',
            'password': 'securepassword',
            'password_confirm': 'securepassword'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')
    
    def test_user_login(self):
        """
        Test user login endpoint
        """
        # Create a user
        User.objects.create_user(
            email='test@example.com',
            full_name='Test User',
            password='securepassword'
        )
        
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'securepassword'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_token_refresh(self):
        """
        Test token refresh endpoint
        """
        # Create a user
        User.objects.create_user(
            email='test@example.com',
            full_name='Test User',
            password='securepassword'
        )
        
        # Get tokens
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'securepassword'
        }
        
        response = self.client.post(url, data, format='json')
        refresh_token = response.data['refresh']
        
        # Test refresh endpoint
        url = reverse('token_refresh')
        data = {
            'refresh': refresh_token
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)