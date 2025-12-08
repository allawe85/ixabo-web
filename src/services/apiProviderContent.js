import { supabase } from "../lib/supabase";

// --- MENU ---

export async function getProviderMenu(providerId) {
  const { data, error } = await supabase
    .from("provider_menu")
    .select("*")
    .eq("ProviderID", providerId)
    .order("ImageOrder", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createMenuItem(item) {
  const { data, error } = await supabase
    .from("provider_menu")
    .insert([item])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("provider_menu").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

export async function updateMenuItem({ id, ...updates }) {
  const { data, error } = await supabase
    .from("provider_menu")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// --- GALLERY ---

export async function getProviderGallery(providerId) {
  const { data, error } = await supabase
    .from("provider_gallery")
    .select("*")
    .eq("ProviderID", providerId)
    .order("ImageOrder", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createGalleryItem(item) {
  const { data, error } = await supabase
    .from("provider_gallery")
    .insert([item])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGalleryItem(id) {
  const { error } = await supabase.from("provider_gallery").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

export async function updateGalleryItem({ id, ...updates }) {
  const { data, error } = await supabase
    .from("provider_gallery")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}