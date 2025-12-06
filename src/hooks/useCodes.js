import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPackageGroups, 
  getDiscountCodes, 
  deletePackageGroup, 
  deleteDiscountCode 
} from "../services/apiCodes";
import { toast } from "sonner";

export function usePackageGroups() {
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ["packageGroups"],
    queryFn: getPackageGroups,
  });
  return { groups, isLoading, error };
}

export function useDiscountCodes() {
  const { data: discounts, isLoading, error } = useQuery({
    queryKey: ["discountCodes"],
    queryFn: getDiscountCodes,
  });
  return { discounts, isLoading, error };
}

export function useDeletePackageGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePackageGroup,
    onSuccess: () => {
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["packageGroups"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscountCode,
    onSuccess: () => {
      toast.success("Discount code deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}