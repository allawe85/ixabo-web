import { supabase } from "../lib/supabase";

// Get list of ads (joined with provider info via View)
export async function getFeaturedAds() {
  const { data, error } = await supabase
    .from("ViewAds") // Uses your existing view
    .select("*")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Create a new ad
export async function createFeaturedAd(ad) {
  const { data, error } = await supabase
    .from("provider_ads")
    .insert([ad])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// Delete an ad
export async function deleteFeaturedAd(id) {
  const { error } = await supabase
    .from("provider_ads")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// Helper to search providers for the dropdown
export async function searchProvidersForAd(query) {
  if (!query) return [];
  const { data, error } = await supabase
    .from("provider")
    .select("ID, Name, NameAr, ImageUrl")
    .ilike("Name", `%${query}%`)
    .limit(5);

  if (error) throw new Error(error.message);
  return data;
}