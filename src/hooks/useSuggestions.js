import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSuggestions, deleteSuggestion } from "../services/apiSuggestions";
import { toast } from "sonner";

export function useSuggestions() {
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestions,
  });
  return { suggestions, isLoading, error };
}

export function useDeleteSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSuggestion,
    onSuccess: () => {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onError: (err) => toast.error(err.message),
  });
}