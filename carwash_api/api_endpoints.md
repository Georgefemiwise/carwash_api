# Car Wash API Endpoints

## Authentication

### User Registration
- **Endpoint:** POST /api/auth/register/
- **Description:** Register a new user account (customer)
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "customer@example.com",
    "full_name": "Customer Name",
    "password": "securepassword",
    "password_confirm": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "customer@example.com",
      "full_name": "Customer Name"
    },
    "message": "User registered successfully"
  }
  ```

### User Login
- **Endpoint:** POST /api/auth/login/
- **Description:** Authenticate user and receive JWT tokens
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "customer@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "access": "eyJ0eXAiOiJKV...",
    "refresh": "eyJ0eXAiOiJKV...",
    "user": {
      "id": 1,
      "email": "customer@example.com",
      "full_name": "Customer Name",
      "date_joined": "2023-04-01T12:00:00Z"
    }
  }
  ```

### Token Refresh
- **Endpoint:** POST /api/auth/refresh/
- **Description:** Get a new access token using refresh token
- **Access:** Authenticated users
- **Request Body:**
  ```json
  {
    "refresh": "eyJ0eXAiOiJKV..."
  }
  ```
- **Response:**
  ```json
  {
    "access": "eyJ0eXAiOiJKV..."
  }
  ```

## Car Management

### List/Create Cars
- **Endpoint:** GET, POST /api/cars/
- **Description:** List all cars for the current user or create a new car
- **Access:** Authenticated users (customers can only see their own cars, staff can see all)
- **Query Parameters (for GET):**
  - `owner`: Filter by owner ID (staff only)
  - `make`: Filter by car make
  - `license_plate`: Filter by license plate
  - `search`: Search in make, model, and license plate fields
- **Request Body (for POST):**
  ```json
  {
    "make": "Toyota",
    "model": "Camry",
    "license_plate": "ABC123",
    "color": "Blue"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "owner": 1,
    "owner_email": "customer@example.com",
    "make": "Toyota",
    "model": "Camry",
    "license_plate": "ABC123",
    "color": "Blue",
    "created_at": "2023-04-01T12:30:00Z"
  }
  ```

### Retrieve/Update/Delete Car
- **Endpoint:** GET, PUT, PATCH, DELETE /api/cars/{id}/
- **Description:** Retrieve, update, or delete a specific car
- **Access:** Car owner or staff
- **Request Body (for PUT/PATCH):**
  ```json
  {
    "make": "Toyota",
    "model": "Corolla",
    "license_plate": "ABC123",
    "color": "Red"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "owner": 1,
    "owner_email": "customer@example.com",
    "make": "Toyota",
    "model": "Corolla",
    "license_plate": "ABC123",
    "color": "Red",
    "created_at": "2023-04-01T12:30:00Z"
  }
  ```

## Service Requests

### List/Create Service Requests
- **Endpoint:** GET, POST /api/service-requests/
- **Description:** List all service requests for current user or create a new service request
- **Access:** Authenticated users (customers can only see their own requests, staff can see all)
- **Query Parameters (for GET):**
  - `status`: Filter by status (pending, in_progress, completed)
  - `assigned_worker`: Filter by assigned worker ID
  - `car__owner`: Filter by car owner ID (staff only)
  - `search`: Search in license plate and description
- **Request Body (for POST):**
  ```json
  {
    "car": 1,
    "description": "Full car wash and interior cleaning"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "car": 1,
    "car_details": {
      "id": 1,
      "owner": 1,
      "owner_email": "customer@example.com",
      "make": "Toyota",
      "model": "Corolla",
      "license_plate": "ABC123",
      "color": "Red",
      "created_at": "2023-04-01T12:30:00Z"
    },
    "description": "Full car wash and interior cleaning",
    "requested_at": "2023-04-01T13:00:00Z",
    "status": "pending",
    "assigned_worker": null,
    "assigned_worker_details": null,
    "completed_at": null,
    "cost": "0.00"
  }
  ```

### Retrieve/Update/Delete Service Request
- **Endpoint:** GET, PUT, PATCH, DELETE /api/service-requests/{id}/
- **Description:** Retrieve, update, or delete a specific service request
- **Access:** Car owner or staff
- **Request Body (for PUT/PATCH):**
  ```json
  {
    "status": "in_progress",
    "cost": "50.00"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "car": 1,
    "car_details": { ... },
    "description": "Full car wash and interior cleaning",
    "requested_at": "2023-04-01T13:00:00Z",
    "status": "in_progress",
    "assigned_worker": null,
    "assigned_worker_details": null,
    "completed_at": null,
    "cost": "50.00"
  }
  ```

### Assign Worker to Service Request
- **Endpoint:** POST /api/service-requests/{id}/assign_worker/
- **Description:** Assign a worker to a service request
- **Access:** Staff only
- **Request Body:**
  ```json
  {
    "worker_id": 1
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "car": 1,
    "car_details": { ... },
    "description": "Full car wash and interior cleaning",
    "requested_at": "2023-04-01T13:00:00Z",
    "status": "in_progress",
    "assigned_worker": 1,
    "assigned_worker_details": {
      "id": 1,
      "user": 2,
      "user_details": {
        "id": 2,
        "email": "worker@example.com",
        "full_name": "Worker Name"
      },
      "role": "car_washer",
      "phone_number": "123-456-7890",
      "is_active": true,
      "joined_date": "2023-03-15"
    },
    "completed_at": null,
    "cost": "50.00"
  }
  ```

### Update Service Request Status
- **Endpoint:** POST /api/service-requests/{id}/update_status/
- **Description:** Update the status of a service request
- **Access:** Staff only
- **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "car": 1,
    "car_details": { ... },
    "description": "Full car wash and interior cleaning",
    "requested_at": "2023-04-01T13:00:00Z",
    "status": "completed",
    "assigned_worker": 1,
    "assigned_worker_details": { ... },
    "completed_at": "2023-04-01T14:30:00Z",
    "cost": "50.00"
  }
  ```

## Transactions

### List/Create Transactions
- **Endpoint:** GET, POST /api/transactions/
- **Description:** List all transactions or create a new transaction
- **Access:** Authenticated users for viewing (customers see only their own, staff see all), staff only for creation
- **Query Parameters (for GET):**
  - `payment_method`: Filter by payment method
  - `service_request__status`: Filter by service request status
  - `search`: Search in license plate
- **Request Body (for POST):**
  ```json
  {
    "service_request": 1,
    "amount": "50.00",
    "payment_method": "credit_card"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "service_request": 1,
    "service_request_details": { ... },
    "amount": "50.00",
    "payment_method": "credit_card",
    "timestamp": "2023-04-01T14:45:00Z"
  }
  ```

### Retrieve Transaction
- **Endpoint:** GET /api/transactions/{id}/
- **Description:** Retrieve a specific transaction
- **Access:** Car owner or staff
- **Response:**
  ```json
  {
    "id": 1,
    "service_request": 1,
    "service_request_details": { ... },
    "amount": "50.00",
    "payment_method": "credit_card",
    "timestamp": "2023-04-01T14:45:00Z"
  }
  ```

## Staff Management

### List/Create Workers
- **Endpoint:** GET, POST /api/workers/
- **Description:** List all workers or register a new worker
- **Access:** Staff only (supervisors and admins can see all, car washers can only see themselves)
- **Query Parameters (for GET):**
  - `role`: Filter by role
  - `is_active`: Filter by active status
  - `search`: Search in name, email, and phone number
- **Request Body (for POST /api/workers/register/):**
  ```json
  {
    "email": "newworker@example.com",
    "full_name": "New Worker",
    "password": "securepassword",
    "role": "car_washer",
    "phone_number": "123-456-7890"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "user": 3,
    "user_details": {
      "id": 3,
      "email": "newworker@example.com",
      "full_name": "New Worker"
    },
    "role": "car_washer",
    "phone_number": "123-456-7890",
    "is_active": true,
    "joined_date": "2023-04-02"
  }
  ```

### Retrieve/Update/Delete Worker
- **Endpoint:** GET, PUT, PATCH, DELETE /api/workers/{id}/
- **Description:** Retrieve, update, or delete a specific worker profile
- **Access:** Supervisors and admins
- **Request Body (for PUT/PATCH):**
  ```json
  {
    "role": "supervisor",
    "phone_number": "555-123-4567"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "user": 3,
    "user_details": {
      "id": 3,
      "email": "newworker@example.com",
      "full_name": "New Worker"
    },
    "role": "supervisor",
    "phone_number": "555-123-4567",
    "is_active": true,
    "joined_date": "2023-04-02"
  }
  ```

### Toggle Worker Active Status
- **Endpoint:** POST /api/workers/{id}/toggle_active/
- **Description:** Toggle the active status of a worker
- **Access:** Supervisors and admins
- **Response:**
  ```json
  {
    "id": 2,
    "user": 3,
    "user_details": { ... },
    "role": "supervisor",
    "phone_number": "555-123-4567",
    "is_active": false,
    "joined_date": "2023-04-02"
  }
  ```

## API Documentation
- **Endpoint:** GET /api/schema/
- **Description:** OpenAPI schema for the entire API
- **Access:** Public

- **Endpoint:** GET /api/docs/
- **Description:** Swagger UI documentation
- **Access:** Public

- **Endpoint:** GET /api/redoc/
- **Description:** ReDoc documentation
- **Access:** Public