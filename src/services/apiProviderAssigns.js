import { supabase } from "../lib/supabase";

// --- CATEGORIES ---

export async function getProviderCategories(providerId) {
  const { data, error } = await supabase
    .from("provider_category")
    .select("CategoryID")
    .eq("ProviderID", providerId);

  if (error) throw new Error(error.message);
  return data.map(item => item.CategoryID); // Return array of IDs [1, 2, 5]
}

export async function updateProviderCategories({ providerId, categoryIds }) {
  // 1. Delete all existing assignments
  const { error: deleteError } = await supabase
    .from("provider_category")
    .delete()
    .eq("ProviderID", providerId);

  if (deleteError) throw new Error(deleteError.message);

  // 2. Insert new selections (if any)
  if (categoryIds.length > 0) {
    const rows = categoryIds.map(catId => ({
      ProviderID: providerId,
      CategoryID: catId
    }));

    const { error: insertError } = await supabase
      .from("provider_category")
      .insert(rows);

    if (insertError) throw new Error(insertError.message);
  }
}

// --- GOVERNORATES ---

export async function getProviderGovernorates(providerId) {
  const { data, error } = await supabase
    .from("provider_governorate")
    .select("GovernorateID")
    .eq("ProviderID", providerId);

  if (error) throw new Error(error.message);
  return data.map(item => item.GovernorateID);
}

export async function updateProviderGovernorates({ providerId, governorateIds }) {
  // 1. Delete all existing
  const { error: deleteError } = await supabase
    .from("provider_governorate")
    .delete()
    .eq("ProviderID", providerId);

  if (deleteError) throw new Error(deleteError.message);

  // 2. Insert new
  if (governorateIds.length > 0) {
    const rows = governorateIds.map(govId => ({
      ProviderID: providerId,
      GovernorateID: govId
    }));

    const { error: insertError } = await supabase
      .from("provider_governorate")
      .insert(rows);

    if (insertError) throw new Error(insertError.message);
  }
}