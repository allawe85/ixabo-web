import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProviderUsers, 
  searchUsers, 
  addSubProvider, 
  removeSubProvider 
} from "../services/apiProviderUsers";
import { toast } from "sonner";

export function useProviderUsers(providerId) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["providerUsers", providerId],
    queryFn: () => getProviderUsers(providerId),
    enabled: !!providerId,
  });
  return { users, isLoading };
}

export function useUserSearch(query) {
  const { data: results, isLoading } = useQuery({
    queryKey: ["userSearch", query],
    queryFn: () => searchUsers(query),
    enabled: !!query && query.length > 2, // Only search if query > 2 chars
  });
  return { results, isLoading };
}

export function useSubProviderMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerUsers", providerId] });

  const add = useMutation({
    mutationFn: addSubProvider,
    onSuccess: () => {
      toast.success("Sub-provider added");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: removeSubProvider,
    onSuccess: () => {
      toast.success("Sub-provider removed");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return { add, remove };
}