import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProviders, 
  deleteProvider, 
  createProvider, 
  updateProvider,
  getPersonalizedOfferTypes // Import new service
} from "../services/apiProviders";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

export function useProviders() {
  const { user } = useAuth(); // Get current user info

  const { data: providers, isLoading, error } = useQuery({
    queryKey: ["providers", user?.UserID], // Refetch if user changes
    queryFn: () => getProviders({ userId: user?.UserID, role: user?.Role }),
    enabled: !!user, // Don't run query until user is loaded
  });

  return { providers, isLoading, error };
}

// --- OTHER HOOKS ---

export function usePersonalizedOfferTypes() {
  const { data: types, isLoading, error } = useQuery({
    queryKey: ["personalizedOfferTypes"],
    queryFn: getPersonalizedOfferTypes,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });
  return { types, isLoading, error };
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      toast.success("Provider deleted");
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      toast.success("Provider created successfully");
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProvider,
    onSuccess: () => {
      toast.success("Provider updated successfully");
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
    onError: (err) => toast.error(err.message),
  });
}