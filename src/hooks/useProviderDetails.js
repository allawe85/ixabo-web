import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../services/apiProviderDetails";
import { toast } from "sonner";

// --- NUMBERS ---
export function useProviderNumbers(providerId) {
  const { data, isLoading } = useQuery({
    queryKey: ["providerNumbers", providerId],
    queryFn: () => api.getProviderNumbers(providerId),
    enabled: !!providerId,
  });
  return { data, isLoading };
}

export function useNumberMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerNumbers", providerId] });

  return {
    create: useMutation({ mutationFn: api.createProviderNumber, onSuccess: () => { toast.success("Number added"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateProviderNumber, onSuccess: () => { toast.success("Number updated"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteProviderNumber, onSuccess: () => { toast.success("Number deleted"); invalidate(); } }),
  };
}

// --- LOCATIONS ---
export function useProviderLocations(providerId) {
  const { data, isLoading } = useQuery({
    queryKey: ["providerLocations", providerId],
    queryFn: () => api.getProviderLocations(providerId),
    enabled: !!providerId,
  });
  return { data, isLoading };
}

export function useLocationMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerLocations", providerId] });

  return {
    create: useMutation({ mutationFn: api.createProviderLocation, onSuccess: () => { toast.success("Location added"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateProviderLocation, onSuccess: () => { toast.success("Location updated"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteProviderLocation, onSuccess: () => { toast.success("Location deleted"); invalidate(); } }),
  };
}

// --- LINKS ---
export function useProviderContacts(providerId) {
  const { data, isLoading } = useQuery({
    queryKey: ["providerContacts", providerId],
    queryFn: () => api.getProviderContacts(providerId),
    enabled: !!providerId,
  });
  return { data, isLoading };
}

export function useContactTypes() {
  const { data } = useQuery({ queryKey: ["contactTypes"], queryFn: api.getContactTypes });
  return { data };
}

export function useContactMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerContacts", providerId] });

  return {
    create: useMutation({ mutationFn: api.createProviderContact, onSuccess: () => { toast.success("Link added"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteProviderContact, onSuccess: () => { toast.success("Link deleted"); invalidate(); } }),
  };
}