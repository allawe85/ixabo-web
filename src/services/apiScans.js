import { supabase } from "../lib/supabase";

/**
 * Fetches all scans.
 * Uses 'ViewScans' view for joined data.
 */
export async function getScans() {
  const { data, error } = await supabase
    .from("ViewScans") // Using your view
    // Note: Lowercase column names are typical for Views in Supabase unless forced otherwise.
    // I'll use PascalCase as per your provided Dart file, but be prepared to switch if Supabase returns lowercase.
    .select("*")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Updates a scan status (Approve/Reject).
 * We update the raw 'offer_scan' table, not the view.
 */
export async function updateScanStatus({ id, status, userId }) {
  const { error } = await supabase
    .from("offer_scan")
    .update({ 
      Status: status,
      ProviderUserID: userId, // Track who approved/rejected it
      StatusOrigin: status === 'COMPLETE' ? 'COMPLETE_M' : 'REJECT_M' // Matching your Flutter logic
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getScansByProvider(providerId) {
  const { data, error } = await supabase
    .from("ViewScans")
    .select("*")
    .eq("ProviderID", providerId)
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}