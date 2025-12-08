import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProviderMenu, createMenuItem, deleteMenuItem, updateMenuItem,
  getProviderGallery, createGalleryItem, deleteGalleryItem, updateGalleryItem
} from "../services/apiProviderContent";
import { toast } from "sonner";

// --- MENU HOOKS ---

export function useProviderMenu(providerId) {
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["providerMenu", providerId],
    queryFn: () => getProviderMenu(providerId),
    enabled: !!providerId,
  });
  return { menuItems, isLoading };
}

export function useMenuMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerMenu", providerId] });

  const create = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => { toast.success("Menu item added"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  const update = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => { toast.success("Menu item updated"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  const remove = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => { toast.success("Menu item deleted"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  return { create, update, remove };
}

// --- GALLERY HOOKS ---

export function useProviderGallery(providerId) {
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ["providerGallery", providerId],
    queryFn: () => getProviderGallery(providerId),
    enabled: !!providerId,
  });
  return { galleryItems, isLoading };
}

export function useGalleryMutations(providerId) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["providerGallery", providerId] });

  const create = useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => { toast.success("Gallery item added"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  const update = useMutation({
    mutationFn: updateGalleryItem,
    onSuccess: () => { toast.success("Gallery item updated"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  const remove = useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => { toast.success("Gallery item deleted"); invalidate(); },
    onError: (e) => toast.error(e.message)
  });

  return { create, update, remove };
}