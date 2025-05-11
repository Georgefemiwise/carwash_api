import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import {
  Car,
  CarCreateRequest,
  CarUpdateRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// Get all cars (with optional owner filter)

export const useCars = (ownerId?: string) => {
  const queryKey = ownerId ? ["cars", ownerId] : ["cars"];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = ownerId ? { ownerId } : undefined;
      const response = await apiClient.get("/cars/", { params });
      return response.data;
    },
  });

  const results = data?.results ?? [];

  return {
    cars: results,
    totalCars: results.length,
    isLoading,
    error,
  };
};


// Get a single car by ID
export const useCar = (id: string) => {
  const {
    data: car,
    isLoading,
    error,
  } = useQuery<Car>({
    queryKey: ["cars", id],
    queryFn: async () => {
      const response = await apiClient.get(`/cars/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    car,
    isLoading,
    error,
  };
};

// Hooks for car mutations
export const useCarMutations = () => {
  const queryClient = useQueryClient();

  // Create a new car
  const createCar = useMutation<ApiResponse<Car>, Error, CarCreateRequest>({
    mutationFn: async (newCar) => {
      // console.log("...........................", newCar);

      const response = await apiClient.post("/cars/", newCar);
      console.log(response.data);

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the cars list
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  // Update an existing car
  const updateCar = useMutation<
    ApiResponse<Car>,
    Error,
    { id: string; data: CarUpdateRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/cars/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific car and the cars list
      queryClient.invalidateQueries({ queryKey: ["cars", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  // Delete a car
  const deleteCar = useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/cars/${id}/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch the cars list
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      // Remove the specific car from the cache
      queryClient.removeQueries({ queryKey: ["cars", id] });
    },
  });

  return {
    createCar,
    updateCar,
    deleteCar,
  };
};
