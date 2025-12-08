import { supabase } from "../lib/supabase";

export async function getSalesPoints() {
  const { data, error } = await supabase
    .from("sales_point")
    .select("*")
    .order("ID", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSalesPoint(id) {
  const { error } = await supabase.from("sales_point").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW: Create & Update Logic ---

export async function createSalesPoint(newPoint) {
  const { data, error } = await supabase
    .from("sales_point")
    .insert([newPoint])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSalesPoint({ id, ...updates }) {
  const { data, error } = await supabase
    .from("sales_point")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}