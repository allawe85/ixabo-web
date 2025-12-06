import { supabase } from "../lib/supabase";

export async function getPackages() {
  const { data, error } = await supabase
    .from("package")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePackage(id) {
  const { error } = await supabase.from("package").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTIONS ---

export async function createPackage(pkg) {
  const { data, error } = await supabase
    .from("package")
    .insert([pkg])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updatePackage({ id, ...updates }) {
  const { data, error } = await supabase
    .from("package")
    .update(updates)
    .eq("ID", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}