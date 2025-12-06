import { supabase } from "../lib/supabase";

/**
 * Fetches all governorates.
 * @returns {Promise<Array>}
 */
export async function getGovernorates() {
  const { data, error } = await supabase
    .from("governorate")
    .select("*")
    .order("ID", { ascending: true }); // Usually ordered by ID or Name

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes a governorate by ID.
 * @param {string | number} id
 */
export async function deleteGovernorate(id) {
  const { error } = await supabase.from("governorate").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}