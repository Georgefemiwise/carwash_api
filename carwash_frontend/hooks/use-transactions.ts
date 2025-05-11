import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Transaction, PaginatedResponse } from '@/types';

// Get all transactions with optional filters
export const useTransactions = (filters?: {
  serviceRequestId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const queryKey = ['transactions', filters];
  
  const { data, isLoading, error } = useQuery<PaginatedResponse<Transaction>>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get('/transactions', { params: filters });
      return response.data;
    },
  });

  return {
    transactions: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
};

// Get a single transaction by ID
export const useTransaction = (id: string) => {
  const { data, isLoading, error } = useQuery<Transaction>({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const response = await apiClient.get(`/transactions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    transaction: data,
    isLoading,
    error,
  };
};