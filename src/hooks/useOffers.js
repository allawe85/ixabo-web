import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../services/apiOffers";
import { toast } from "sonner";

export function useProviderOffers(providerId) {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["providerOffers", providerId],
    queryFn: () => api.getProviderOffers(providerId),
    enabled: !!providerId,
  });
  return { offers, isLoading };
}

export function useOfferMetadata() {
  const { data: types } = useQuery({ queryKey: ["offerTypes"], queryFn: api.getOfferTypes });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  return { types, categories };
}

export function useOfferMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerOffers", providerId] });

  return {
    create: useMutation({ mutationFn: api.createOffer, onSuccess: () => { toast.success("Offer created"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateOffer, onSuccess: () => { toast.success("Offer updated"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteOffer, onSuccess: () => { toast.success("Offer deleted"); invalidate(); } }),
  };
}