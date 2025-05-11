import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { 
  ServiceRequest, 
  ServiceType, 
  ServiceRequestCreateRequest, 
  ServiceRequestUpdateRequest,
  ApiResponse,
  PaginatedResponse,
  ServiceStatus
} from '@/types';

// Get all service types
export const useServiceTypes = () => {
  const { data, isLoading, error } = useQuery<ServiceType[]>({
    queryKey: ['serviceTypes'],
    queryFn: async () => {
      // const response = await apiClient.get("/service-requests");
      const response = await apiClient.get('/service-types');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


  return {
    serviceTypes: data?.results ?? [],
    isLoading,
    error,
  };
};

// Get all service requests with filters
export const useServiceRequests = (filters?: {
  customerId?: string;
  carId?: string;
  workerId?: string;
  status?: ServiceStatus;
}) => {
  const queryKey = ['serviceRequests', filters];
  
  const { data, isLoading, error } = useQuery<PaginatedResponse<ServiceRequest>>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get('/service-requests', { params: filters });
      return response.data;
    },
  });

  return {
    serviceRequests: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
};

// Get a single service request by ID
export const useServiceRequest = (id: string) => {
  const { data, isLoading, error } = useQuery<ServiceRequest>({
    queryKey: ['serviceRequests', id],
    queryFn: async () => {
      const response = await apiClient.get(`/service-requests/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    serviceRequest: data,
    isLoading,
    error,
  };
};

// Hooks for service request mutations
export const useServiceRequestMutations = () => {
  const queryClient = useQueryClient();

  // Create a new service request
  const createServiceRequest = useMutation<
    ApiResponse<ServiceRequest>, 
    Error, 
    ServiceRequestCreateRequest
  >({
    mutationFn: async (newRequest) => {
      const response = await apiClient.post('/service-requests', newRequest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  // Update an existing service request
  const updateServiceRequest = useMutation<
    ApiResponse<ServiceRequest>, 
    Error, 
    { id: string; data: ServiceRequestUpdateRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/service-requests/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  // Cancel a service request
  const cancelServiceRequest = useMutation<ApiResponse<ServiceRequest>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.put(`/service-requests/${id}/cancel/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests', id] });
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  return {
    createServiceRequest,
    updateServiceRequest,
    cancelServiceRequest,
  };
};