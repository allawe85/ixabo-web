import { supabase } from "../lib/supabase";

export async function getProviders() {
  const { data, error } = await supabase
    .from("provider")
    .select("*, offer(count)")
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProvider(id) {
  const { error } = await supabase.from("provider").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTIONS ---

/**
 * Fetches personalized offer types for the dropdown.
 */
export async function getPersonalizedOfferTypes() {
  const { data, error } = await supabase
    .from("personalized_offer_type")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createProvider(provider) {
  const { data, error } = await supabase
    .from("provider")
    .insert([provider])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProvider({ id, ...updates }) {
  const { data, error } = await supabase
    .from("provider")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}