import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProviders, deleteProvider } from "../services/apiProviders.js";

export function useProviders() {
  const {
    data: providers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["providers"], // The cache key
    queryFn: getProviders,
    staleTime: 5 * 60 * 1000, // Data stays "fresh" for 5 minutes
  });

  return { providers, isLoading, error };
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      // Automatically refresh the list after deletion
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
}