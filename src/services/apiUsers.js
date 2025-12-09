import { supabase } from "../lib/supabase";

/**
 * Fetches all users.
 */
export async function getUsers() {
  const { data, error } = await supabase
    .from("user_info")
    .select("*")
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from("user_info").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTION ---

export async function updateUserRole({ id, role }) {
  const { error } = await supabase
    .from("user_info")
    .update({ Role: role })
    .eq("ID", id);

  if (error) throw new Error(error.message);
}