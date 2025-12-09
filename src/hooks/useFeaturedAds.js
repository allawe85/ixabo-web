import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getFeaturedAds, 
  createFeaturedAd, 
  deleteFeaturedAd,
  searchProvidersForAd
} from "../services/apiFeaturedAds";
import { toast } from "sonner";

export function useFeaturedAds() {
  const { data: ads, isLoading, error } = useQuery({
    queryKey: ["featuredAds"],
    queryFn: getFeaturedAds,
  });
  return { ads, isLoading, error };
}

export function useProviderSearch(query) {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["providerSearch", query],
    queryFn: () => searchProvidersForAd(query),
    enabled: !!query && query.length > 1, // Only search if 2+ chars
  });
  return { providers, isLoading };
}

export function useFeaturedAdMutations() {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createFeaturedAd,
    onSuccess: () => {
      toast.success("Ad created successfully");
      queryClient.invalidateQueries({ queryKey: ["featuredAds"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: deleteFeaturedAd,
    onSuccess: () => {
      toast.success("Ad deleted");
      queryClient.invalidateQueries({ queryKey: ["featuredAds"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { create, remove };
}