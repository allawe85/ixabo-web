import { supabase } from "../lib/supabase";

// --- NUMBERS ---
export async function getProviderNumbers(providerId) {
  const { data, error } = await supabase
    .from("provider_number")
    .select("*")
    .eq("ProviderID", providerId);
  if (error) throw new Error(error.message);
  return data;
}

export async function createProviderNumber(item) {
  const { data, error } = await supabase.from("provider_number").insert([item]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProviderNumber({ id, ...updates }) {
  const { data, error } = await supabase.from("provider_number").update(updates).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProviderNumber(id) {
  const { error } = await supabase.from("provider_number").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- LOCATIONS ---
export async function getProviderLocations(providerId) {
  const { data, error } = await supabase
    .from("provider_location")
    .select("*")
    .eq("ProvideID", providerId); // Note: Column is ProvideID in schema
  if (error) throw new Error(error.message);
  return data;
}

export async function createProviderLocation(item) {
  const { data, error } = await supabase.from("provider_location").insert([item]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProviderLocation({ id, ...updates }) {
  const { data, error } = await supabase.from("provider_location").update(updates).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProviderLocation(id) {
  const { error } = await supabase.from("provider_location").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- LINKS (CONTACTS) ---
export async function getProviderContacts(providerId) {
  const { data, error } = await supabase
    .from("view_provider_contact") // Use view to get Type Name/Icon
    .select("*")
    .eq("ProviderID", providerId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getContactTypes() {
  const { data, error } = await supabase.from("contact_type").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function createProviderContact(item) {
  const { data, error } = await supabase.from("provider_contact").insert([item]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProviderContact({ providerId, typeId }) {
  const { error } = await supabase
    .from("provider_contact")
    .delete()
    .eq("ProviderID", providerId)
    .eq("ContactTypeID", typeId);
  if (error) throw new Error(error.message);
}