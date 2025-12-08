import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProviderCategories, 
  updateProviderCategories,
  getProviderGovernorates,
  updateProviderGovernorates
} from "../services/apiProviderAssigns";
import { toast } from "sonner";

// --- CATEGORIES HOOKS ---

export function useProviderCategories(providerId) {
  const { data: assignedIds, isLoading } = useQuery({
    queryKey: ["providerCategories", providerId],
    queryFn: () => getProviderCategories(providerId),
    enabled: !!providerId, // Only run if ID is provided
  });
  return { assignedIds: assignedIds || [], isLoading };
}

export function useUpdateProviderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProviderCategories,
    onSuccess: (_, variables) => {
      toast.success("Categories updated successfully");
      queryClient.invalidateQueries({ queryKey: ["providerCategories", variables.providerId] });
      // Also refresh the main providers list to update any counts/badges if needed
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

// --- GOVERNORATES HOOKS ---

export function useProviderGovernorates(providerId) {
  const { data: assignedIds, isLoading } = useQuery({
    queryKey: ["providerGovernorates", providerId],
    queryFn: () => getProviderGovernorates(providerId),
    enabled: !!providerId,
  });
  return { assignedIds: assignedIds || [], isLoading };
}

export function useUpdateProviderGovernorates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProviderGovernorates,
    onSuccess: (_, variables) => {
      toast.success("Governorates updated successfully");
      queryClient.invalidateQueries({ queryKey: ["providerGovernorates", variables.providerId] });
    },
    onError: (err) => toast.error(err.message),
  });
}