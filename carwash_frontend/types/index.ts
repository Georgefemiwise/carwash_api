// User Types
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirm: string;
  role: UserRole;
}

// Car Types
export interface Car {
  id: string;
  ownerId: string;
  owner?: User;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarCreateRequest {
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  owner:string
}

export interface CarUpdateRequest {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  license_plate?: string;
  owner:string
}

// Service Types
export enum ServiceStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  carId: string;
  car?: Car;
  customerId: string;
  customer?: User;
  serviceTypeId: string;
  serviceType?: ServiceType;
  status: ServiceStatus;
  scheduledAt: string;
  completedAt?: string;
  assignedWorkerId?: string;
  assignedWorker?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestCreateRequest {
  carId: string;
  serviceTypeId: string;
  scheduledAt: string;
  notes?: string;
}

export interface ServiceRequestUpdateRequest {
  status?: ServiceStatus;
  scheduledAt?: string;
  completedAt?: string;
  assignedWorkerId?: string;
  notes?: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  serviceRequestId: string;
  serviceRequest?: ServiceRequest;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  ONLINE = "ONLINE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// Dashboard Types
export interface DashboardStats {
  totalCustomers: number;
  totalCars: number;
  totalServices: number;
  completedServices: number;
  pendingServices: number;
  totalRevenue: number;
  recentTransactions: Transaction[];
  upcomingServices: ServiceRequest[];
}

// Worker Stats
export interface WorkerStats {
  id: string;
  name: string;
  completedServices: number;
  assignedServices: number;
  averageServiceTime: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
