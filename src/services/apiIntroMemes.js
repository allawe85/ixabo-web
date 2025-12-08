import { supabase } from "../lib/supabase";

export async function getIntroMemes() {
  const { data, error } = await supabase
    .from("intro_meme")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteIntroMeme(id) {
  const { error } = await supabase.from("intro_meme").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- NEW FUNCTIONS ---

export async function createIntroMeme(meme) {
  const { data, error } = await supabase
    .from("intro_meme")
    .insert([meme])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateIntroMeme({ id, ...updates }) {
  const { data, error } = await supabase
    .from("intro_meme")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}