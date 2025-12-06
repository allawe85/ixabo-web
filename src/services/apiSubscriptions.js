import { supabase } from "../lib/supabase";

export async function getSubscriptions() {
  // Using the view provided in your schema
  const { data, error } = await supabase
    .from("ViewSubscribtion") 
    .select("*")
    .order("CreatedAt", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}