import { supabase } from "../lib/supabase";

export async function getDiscountCodes() {
  const { data, error } = await supabase
    .from("discount_code")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createDiscountCode(code) {
  const { data, error } = await supabase
    .from("discount_code")
    .insert([code])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDiscountCode(id) {
  const { error } = await supabase
    .from("discount_code")
    .delete()
    .eq("id", id); // Note: id is lowercase in your schema

  if (error) throw new Error(error.message);
}