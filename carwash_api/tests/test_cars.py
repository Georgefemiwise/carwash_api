from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authentication.models import User
from cars.models import Car, ServiceRequest, Transaction
from staff.models import WorkerProfile

class CarTests(APITestCase):
    def setUp(self):
        # Create customer user
        self.customer = User.objects.create_user(
            email='customer@example.com',
            full_name='Customer User',
            password='securepassword'
        )
        
        # Create staff user
        self.staff = User.objects.create_user(
            email='staff@example.com',
            full_name='Staff User',
            password='securepassword',
            is_staff=True
        )
        
        # Create worker profile for staff
        self.worker = WorkerProfile.objects.create(
            user=self.staff,
            role='supervisor',
            phone_number='123-456-7890'
        )
        
        # Create car for customer
        self.car = Car.objects.create(
            owner=self.customer,
            make='Toyota',
            model='Camry',
            license_plate='ABC123',
            color='Blue'
        )
        
        # Create service request
        self.service_request = ServiceRequest.objects.create(
            car=self.car,
            description='Full car wash',
            status='pending'
        )
    
    def test_car_list_as_customer(self):
        """
        Test car listing as customer (should only see own cars)
        """
        self.client.force_authenticate(user=self.customer)
        url = reverse('car-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['license_plate'], 'ABC123')
    
    def test_car_list_as_staff(self):
        """
        Test car listing as staff (should see all cars)
        """
        # Create another customer and car
        other_customer = User.objects.create_user(
            email='other@example.com',
            full_name='Other User',
            password='securepassword'
        )
        
        Car.objects.create(
            owner=other_customer,
            make='Honda',
            model='Civic',
            license_plate='XYZ789',
            color='Red'
        )
        
        self.client.force_authenticate(user=self.staff)
        url = reverse('car-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_car_create(self):
        """
        Test car creation
        """
        self.client.force_authenticate(user=self.customer)
        url = reverse('car-list')
        data = {
            'make': 'Honda',
            'model': 'Accord',
            'license_plate': 'DEF456',
            'color': 'Black'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Car.objects.count(), 2)
        self.assertEqual(Car.objects.filter(owner=self.customer).count(), 2)
    
    def test_service_request_create(self):
        """
        Test service request creation
        """
        self.client.force_authenticate(user=self.customer)
        url = reverse('service-request-list')
        data = {
            'car': self.car.id,
            'description': 'Interior cleaning'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceRequest.objects.count(), 2)
        self.assertEqual(response.data['status'], 'pending')
    
    def test_assign_worker(self):
        """
        Test assigning worker to service request
        """
        self.client.force_authenticate(user=self.staff)
        url = reverse('service-request-assign-worker', args=[self.service_request.id])
        data = {
            'worker_id': self.worker.id
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh from db
        self.service_request.refresh_from_db()
        self.assertEqual(self.service_request.assigned_worker, self.worker)
    
    def test_transaction_create(self):
        """
        Test transaction creation (staff only)
        """
        self.client.force_authenticate(user=self.staff)
        url = reverse('transaction-list')
        data = {
            'service_request': self.service_request.id,
            'amount': '50.00',
            'payment_method': 'credit_card'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)
        
        # Test customer cannot create transactions
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)