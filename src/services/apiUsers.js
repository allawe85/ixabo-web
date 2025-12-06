import { supabase } from "../lib/supabase";

/**
 * Fetches all users.
 * @returns {Promise<Array>}
 */
export async function getUsers() {
  const { data, error } = await supabase
    .from("user_info")
    .select("*")
    .order("ID", { ascending: false }); // Newest users first

  if (error) throw new Error(error.message);
  return data;
}

// Note: Usually we don't hard-delete users easily because of foreign keys (orders, scans, etc.),
// but I'll add the function just in case you need it.
export async function deleteUser(id) {
  const { error } = await supabase.from("user_info").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}