import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getScans, updateScanStatus } from "../services/apiScans";
import { toast } from "sonner";

export function useScans() {
  const { data: scans, isLoading, error } = useQuery({
    queryKey: ["scans"],
    queryFn: getScans,
    // Scans update frequently, so keep staleTime short
    staleTime: 30 * 1000, 
    refetchInterval: 60 * 1000, // Auto-refresh every minute to catch new scans
  });

  return { scans, isLoading, error };
}

export function useUpdateScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScanStatus,
    onSuccess: () => {
      toast.success("Scan status updated");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
    onError: (err) => toast.error(err.message),
  });
}