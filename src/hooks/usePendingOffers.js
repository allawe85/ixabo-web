import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingOffers, approveOffer, rejectOffer } from "../services/apiPendingOffers";
import { toast } from "sonner";

export function usePendingOffers() {
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ["pendingOffers"],
    queryFn: getPendingOffers,
  });
  return { offers, isLoading, error };
}

export function usePendingOfferMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["pendingOffers"] });

  const approve = useMutation({
    mutationFn: approveOffer,
    onSuccess: () => {
      toast.success("Offer approved and live");
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const reject = useMutation({
    mutationFn: rejectOffer,
    onSuccess: () => {
      toast.success("Offer rejected");
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return { approve, reject };
}