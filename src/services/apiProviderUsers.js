import { supabase } from "../lib/supabase";

// --- FETCHING ---

export async function getProviderUsers(providerId) {
  const { data, error } = await supabase
    .from("view_provider_user") // Using the view you shared
    .select("*")
    .eq("ProviderID", providerId);

  if (error) throw new Error(error.message);
  return data;
}

export async function searchUsers(query) {
  if (!query) return [];
  const { data, error } = await supabase
    .from("user_info")
    .select("*")
    .or(`Name.ilike.%${query}%,PhoneNumber.ilike.%${query}%,Email.ilike.%${query}%`)
    .limit(10);

  if (error) throw new Error(error.message);
  return data;
}

// --- ACTIONS ---

export async function addSubProvider({ providerId, userId }) {
  // 1. Update User Role
  const { error: updateError } = await supabase
    .from("user_info")
    .update({ Role: "SUBPROVIDER" })
    .eq("UserID", userId);

  if (updateError) throw new Error(updateError.message);

  // 2. Link to Provider
  const { error: insertError } = await supabase
    .from("provider_user")
    .insert([{ ProviderID: providerId, UserID: userId }]);

  if (insertError) throw new Error(insertError.message);
}

export async function removeSubProvider({ userId }) {
  // 1. Update User Role back to USER
  const { error: updateError } = await supabase
    .from("user_info")
    .update({ Role: "USER" })
    .eq("UserID", userId);

  if (updateError) throw new Error(updateError.message);

  // 2. Remove Link (The trigger might handle this, but manual delete is safer)
  const { error: deleteError } = await supabase
    .from("provider_user")
    .delete()
    .eq("UserID", userId);

  if (deleteError) throw new Error(deleteError.message);
}