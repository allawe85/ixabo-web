import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../services/apiApprovals";
import { toast } from "sonner";

// --- LEADS ---
export function useApprovals() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: api.getLeads,
  });
  return { leads, isLoading };
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateLeadStatus,
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

// --- OFFERS ---
export function usePendingOffers() {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["pendingOffers"],
    queryFn: api.getPendingOffers,
  });
  return { offers, isLoading };
}

export function usePendingOfferMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["pendingOffers"] });

  return {
    approve: useMutation({
      mutationFn: api.approveOffer,
      onSuccess: () => { toast.success("Offer Approved"); invalidate(); }
    }),
    reject: useMutation({
      mutationFn: api.rejectOffer,
      onSuccess: () => { toast.success("Offer Rejected"); invalidate(); }
    }),
  };
}