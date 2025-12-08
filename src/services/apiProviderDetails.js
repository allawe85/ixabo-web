import { supabase } from "../lib/supabase";

// --- NUMBERS ---
export async function getProviderNumbers(providerId) {
  const { data, error } = await supabase
    .from("provider_number")
    .select("*")
    .eq("ProviderID", providerId); // Correct: ProviderID
  if (error) throw new Error(error.message);
  return data;
}

export async function createProviderNumber(item) {
  const { data, error } = await supabase.from("provider_number").insert([item]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProviderNumber({ id, ...updates }) {
  // Correct: 'id' is lowercase in your Dart file: set id(int value) => setField<int>('id', value);
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
    .eq("ProvideID", providerId); // Correct: ProvideID (from your uploaded file)
  if (error) throw new Error(error.message);
  return data;
}

export async function createProviderLocation(item) {
  const { data, error } = await supabase.from("provider_location").insert([item]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProviderLocation({ id, ...updates }) {
  // Correct: 'id' is lowercase in provider_location.dart
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
    .from("view_provider_contact") 
    .select("*")
    .eq("ProviderID", providerId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getContactTypes() {
  const { data, error } = await supabase
    .from("contact_type")
    .select("*"); 
    // Dart says: get id => getField<int>('ID')!; -> So columns are likely ID, Name
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