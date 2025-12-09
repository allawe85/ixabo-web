import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDiscountCodes, 
  createDiscountCode, 
  deleteDiscountCode 
} from "../services/apiDiscountCodes";
import { toast } from "sonner";

export function useDiscountCodes() {
  const { data: codes, isLoading, error } = useQuery({
    queryKey: ["discountCodes"],
    queryFn: getDiscountCodes,
  });
  return { codes, isLoading, error };
}

export function useDeleteDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscountCode,
    onSuccess: () => {
      toast.success("Code deleted");
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useCreateDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiscountCode,
    onSuccess: () => {
      toast.success("Code created successfully");
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}