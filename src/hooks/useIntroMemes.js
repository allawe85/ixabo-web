import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIntroMemes, deleteIntroMeme } from "../services/apiIntroMemes";
import { toast } from "sonner";

export function useIntroMemes() {
  const { data: memes, isLoading, error } = useQuery({
    queryKey: ["introMemes"],
    queryFn: getIntroMemes,
  });

  return { memes, isLoading, error };
}

export function useDeleteIntroMeme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIntroMeme,
    onSuccess: () => {
      toast.success("Meme deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["introMemes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}