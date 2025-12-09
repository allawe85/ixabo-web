import { supabase } from "../lib/supabase";

export async function getPendingOffers() {
  const { data, error } = await supabase
    .from("offer")
    .select("*, provider(Name, NameAr, ImageUrl), category(Name, NameAr), offer_type(Name, NameAr)")
    .eq("IsActive", false)
    .gt("EffectiveTo", new Date().toISOString()) // Only show valid future offers
    .order("ID", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function approveOffer(id) {
  const { error } = await supabase
    .from("offer")
    .update({ IsActive: true })
    .eq("ID", id);

  if (error) throw new Error(error.message);
}

export async function rejectOffer(id) {
  // Option A: Delete it
  const { error } = await supabase.from("offer").delete().eq("ID", id);
  // Option B: Mark as rejected (if you have a status column). For now, delete is common.
  if (error) throw new Error(error.message);
}