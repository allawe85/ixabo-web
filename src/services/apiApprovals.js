import { supabase } from "../lib/supabase";

export async function getLeads() {
  const { data, error } = await supabase
    .from("merchant_leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateLeadStatus({ id, status }) {
  const { error } = await supabase.from("merchant_leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}