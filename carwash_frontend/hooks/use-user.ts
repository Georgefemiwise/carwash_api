import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { User } from "@/types";

// Get current authenticated user
export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateUser = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await apiClient.put(
        `/users/${currentUser?.id}`,
        userData
      );
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
  });

  return {
    currentUser,
    isLoading,
    error,
    updateUser,
  };
};

// ✅ Get user by ID
export const useUser = (id: string) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run if ID is available
  });

  return {
    user,
    isLoading,
    error,
  };
};

// ✅ Get all users (optionally by role)
export const useUsers = (role?: string) => {
  const queryKey = role ? ["users", { role }] : ["users"];

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey,
    queryFn: async () => {
      const params = role ? { role } : undefined;
      const response = await apiClient.get("/users", { params });
      return response.data;
    },
  });

  return {
    users,
    isLoading,
    error,
  };
};
