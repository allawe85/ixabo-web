import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGovernorates, deleteGovernorate } from "../services/apiGovernorates";

export function useGovernorates() {
  const {
    data: governorates,
    isLoading,
    error,
  } = useQuery({
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
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}