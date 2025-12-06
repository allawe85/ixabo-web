import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, updateLeadStatus } from "../services/apiApprovals";
import { toast } from "sonner";

export function useApprovals() {
  const { data: leads, isLoading, error } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  return { leads, isLoading, error };
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err) => toast.error(err.message),
  });
}