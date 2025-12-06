import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "../services/apiSubscriptions";

export function useSubscriptions() {
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

  return { subscriptions, isLoading, error };
}