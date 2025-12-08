import { supabase } from "../lib/supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("ViewCategory") // Using View for list
    .select("*")
    .order("Order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("category").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTIONS ---

export async function createCategory(category) {
  const { data, error } = await supabase
    .from("category") // Insert into raw table
    .insert([category])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory({ id, ...updates }) {
  const { data, error } = await supabase
    .from("category") // Update raw table
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}