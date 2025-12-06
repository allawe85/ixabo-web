import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPackages, 
  deletePackage, 
  createPackage, 
  updatePackage 
} from "../services/apiPackages";
import { toast } from "sonner";

export function usePackages() {
  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: 5 * 60 * 1000,
  });

  return { packages, isLoading, error };
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast.success("Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

// --- NEW HOOKS ---

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      toast.success("Package created successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (err) => toast.error(err.message),
  });
}