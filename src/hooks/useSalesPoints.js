import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSalesPoints, 
  deleteSalesPoint, 
  createSalesPoint, 
  updateSalesPoint 
} from "../services/apiSalesPoints";
import { toast } from "sonner"; 

export function useSalesPoints() {
  const { data: salesPoints, isLoading, error } = useQuery({
    queryKey: ["salesPoints"],
    queryFn: getSalesPoints,
  });

  return { salesPoints, isLoading, error };
}

export function useDeleteSalesPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSalesPoint,
    onSuccess: () => {
      toast.success("Sales point deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["salesPoints"] });
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });
}

// --- NEW HOOKS ---

export function useCreateSalesPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSalesPoint,
    onSuccess: () => {
      toast.success("Sales point created successfully");
      queryClient.invalidateQueries({ queryKey: ["salesPoints"] });
    },
    onError: (err) => toast.error(`Failed to create: ${err.message}`),
  });
}

export function useUpdateSalesPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSalesPoint,
    onSuccess: () => {
      toast.success("Sales point updated successfully");
      queryClient.invalidateQueries({ queryKey: ["salesPoints"] });
    },
    onError: (err) => toast.error(`Failed to update: ${err.message}`),
  });
}