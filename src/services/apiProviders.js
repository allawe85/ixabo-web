import { supabase } from "../lib/supabase";

/**
 * Fetches all providers with their offer counts.
 * @returns {Promise<Array>}
 */
export async function getProviders() {
  const { data, error } = await supabase
    .from("provider")
    .select("*, offer(count)")
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/// @ts-ignore
export async function deleteProvider(id) {
  const { error } = await supabase.from("provider").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}