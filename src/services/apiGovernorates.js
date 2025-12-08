import { supabase } from "../lib/supabase";

export async function getGovernorates() {
  const { data, error } = await supabase
    .from("governorate")
    .select("*")
    .order("ID", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGovernorate(id) {
  const { error } = await supabase.from("governorate").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTIONS ---

export async function createGovernorate(gov) {
  const { data, error } = await supabase
    .from("governorate")
    .insert([gov])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateGovernorate({ id, ...updates }) {
  const { data, error } = await supabase
    .from("governorate")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}