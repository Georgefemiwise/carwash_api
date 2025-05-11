import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { DashboardStats, WorkerStats } from '@/types';

// Get dashboard statistics
export const useDashboardStats = () => {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // refresh every 5 minutes
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};

// Get worker statistics
export const useWorkerStats = () => {
  const { data, isLoading, error } = useQuery<WorkerStats[]>({
    queryKey: ['workerStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/worker-stats');
      return response.data;
    },
    refetchInterval: 10 * 60 * 1000, // refresh every 10 minutes
  });

  return {
    workerStats: data || [],
    isLoading,
    error,
  };
};