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

// --- NEW: Pending Offers Logic ---

export async function getPendingOffers() {
  // Fetch inactive offers that are not expired
  const { data, error } = await supabase
    .from("offer")
    .select("*, provider(Name, NameAr, ImageUrl), category(Name, NameAr), offer_type(Name, NameAr)")
    .eq("IsActive", false)
    // Optional: Only show future offers
    // .gt("EffectiveTo", new Date().toISOString()) 
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function approveOffer(id) {
  const { error } = await supabase.from("offer").update({ IsActive: true }).eq("ID", id);
  if (error) throw new Error(error.message);
}

export async function rejectOffer(id) {
  // Hard delete rejected offer
  const { error } = await supabase.from("offer").delete().eq("ID", id);
  if (error) throw new Error(error.message);
}