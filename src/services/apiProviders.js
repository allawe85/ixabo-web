import { supabase } from "../lib/supabase";

export async function getProviders({ userId, role }) {
  let query = supabase
    .from("provider")
    .select("*, offer(count), provider_user!inner(UserID)") // !inner performs an INNER JOIN to filter
    .order("ID", { ascending: false });

  // If NOT Admin, filter by the logged-in UserID
  if (role !== 'ADMIN') {
    // This strictly limits results to providers linked to this user
    query = query.eq("provider_user.UserID", userId);
  } else {
    // For Admins, we want all providers, so we remove the !inner constraint or reset the query
    // Actually, simpler approach for Admin is to NOT join provider_user (to avoid duplicates or filtering)
    query = supabase
      .from("provider")
      .select("*, offer(count)")
      .order("ID", { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProvider(id) {
  const { error } = await supabase.from("provider").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

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