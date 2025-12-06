import { supabase } from "../lib/supabase";

/**
 * Fetches subscription code groups.
 * @returns {Promise<Array>}
 */
export async function getPackageGroups() {
  const { data, error } = await supabase
    .from("ViewPackageCodeGroup") // View from your schema
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetches discount codes.
 * @returns {Promise<Array>}
 */
export async function getDiscountCodes() {
  const { data, error } = await supabase
    .from("discount_code") // Table from your schema
    .select("*")
    .order("expiry", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePackageGroup(id) {
  const { error } = await supabase.from("package_code_group").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteDiscountCode(id) {
  const { error } = await supabase.from("discount_code").delete().eq("id", id);
  if (error) throw new Error(error.message);
}