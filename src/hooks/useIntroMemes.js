import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getIntroMemes, 
  deleteIntroMeme, 
  createIntroMeme, 
  updateIntroMeme 
} from "../services/apiIntroMemes";
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

// --- NEW HOOKS ---

export function useCreateIntroMeme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIntroMeme,
    onSuccess: () => {
      toast.success("Meme created successfully");
      queryClient.invalidateQueries({ queryKey: ["introMemes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateIntroMeme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateIntroMeme,
    onSuccess: () => {
      toast.success("Meme updated successfully");
      queryClient.invalidateQueries({ queryKey: ["introMemes"] });
    },
    onError: (err) => toast.error(err.message),
  });
}