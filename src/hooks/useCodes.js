import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPackageGroups, 
  deletePackageGroup, 
  createPackageGroup,
  insertCodes,
  getGroupCodes
} from "../services/apiCodes";
import { toast } from "sonner";

// --- GROUP HOOKS ---

export function usePackageGroups() {
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ["packageGroups"],
    queryFn: getPackageGroups,
  });
  return { groups, isLoading, error };
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

export function useCreatePackageGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, packageId, count, netPrice }) => {
      // 1. Create the Group
      const group = await createPackageGroup({ name, packageId, count, netPrice });
      
      // 2. Generate Codes locally (10 Alphanumeric Characters)
      const codes = [];
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      for (let i = 0; i < count; i++) {
        let code = "";
        for (let j = 0; j < 10; j++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        codes.push({
          GroupID: group.id,
          PackageID: packageId,
          Code: code,
          IsUsed: false
        });
      }

      // 3. Insert Codes
      await insertCodes(codes);
      return group;
    },
    onSuccess: () => {
      toast.success("Group and codes created successfully");
      queryClient.invalidateQueries({ queryKey: ["packageGroups"] });
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });
}

// --- CODE LIST HOOK ---

export function useGroupCodes(groupId) {
  const { data: codes, isLoading } = useQuery({
    queryKey: ["groupCodes", groupId],
    queryFn: () => getGroupCodes(groupId),
    enabled: !!groupId, // Only fetch if a group is selected
  });
  return { codes, isLoading };
}