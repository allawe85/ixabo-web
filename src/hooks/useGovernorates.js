import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getGovernorates, 
  deleteGovernorate, 
  createGovernorate, 
  updateGovernorate 
} from "../services/apiGovernorates";
import { toast } from "sonner";

export function useGovernorates() {
  const { data: governorates, isLoading, error } = useQuery({
    queryKey: ["governorates"],
    queryFn: getGovernorates,
    staleTime: 5 * 60 * 1000,
  });

  return { governorates, isLoading, error };
}

export function useDeleteGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGovernorate,
    onSuccess: () => {
      toast.success("Governorate deleted");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

// --- NEW HOOKS ---

export function useCreateGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGovernorate,
    onSuccess: () => {
      toast.success("Governorate created successfully");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGovernorate,
    onSuccess: () => {
      toast.success("Governorate updated successfully");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
    onError: (err) => toast.error(err.message),
  });
}