import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotificationCampaigns, 
  createNotificationCampaign, 
  deleteNotificationCampaign 
} from "../services/apiNotifications";
import { toast } from "sonner";

export function useNotificationCampaigns() {
  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notificationCampaigns"],
    queryFn: getNotificationCampaigns,
    staleTime: 5 * 60 * 1000,
  });

  return { campaigns, isLoading, error };
}

export function useCreateNotificationCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotificationCampaign,
    onSuccess: () => {
      toast.success("Campaign created successfully"); // "Pending sending..."
      queryClient.invalidateQueries({ queryKey: ["notificationCampaigns"] });
    },
    onError: (err) => toast.error(`Failed to create: ${err.message}`),
  });
}

export function useDeleteNotificationCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotificationCampaign,
    onSuccess: () => {
      toast.success("Campaign deleted");
      queryClient.invalidateQueries({ queryKey: ["notificationCampaigns"] });
    },
    onError: (err) => toast.error(err.message),
  });
}