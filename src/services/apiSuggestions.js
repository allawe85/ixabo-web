import { supabase } from "../lib/supabase";

export async function getSuggestions() {
  const { data, error } = await supabase
    .from("contact_us")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSuggestion(id) {
  const { error } = await supabase.from("contact_us").delete().eq("id", id);
  if (error) throw new Error(error.message);
}