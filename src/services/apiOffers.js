import { supabase } from "../lib/supabase";

export async function getProviderOffers(providerId) {
  // SIMPLIFIED QUERY: Removed joins to prevent "Relationship not found" errors
  const { data, error } = await supabase
    .from("offer")
    .select("*") 
    .eq("ProviderID", providerId)
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getOfferTypes() {
  const { data, error } = await supabase.from("offer_type").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase.from("category").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function createOffer(offer) {
  const { data, error } = await supabase.from("offer").insert([offer]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateOffer({ id, ...updates }) {
  const { data, error } = await supabase.from("offer").update(updates).eq("ID", id).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteOffer(id) {
  const { error } = await supabase.from("offer").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}