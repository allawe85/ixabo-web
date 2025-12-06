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