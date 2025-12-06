import { supabase } from "../lib/supabase";

/**
 * Fetches all categories with provider counts.
 * Uses the database view 'ViewCategory'.
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  // Select everything from the view
  const { data, error } = await supabase
    .from("ViewCategory")
    .select("*")
    .order("Order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes a category by ID.
 * @param {string | number} id
 */
export async function deleteCategory(id) {
  const { error } = await supabase.from("category").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}