import { supabase } from "../lib/supabase";

/**
 * Fetches main KPI stats from the materialized view.
 * Note: Materialized views need refreshing in DB to stay updated.
 */
export async function getDashboardStats() {
  const { data, error } = await supabase
    .from("dashboard_view")
    .select("*")
    .single(); // It returns one row

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetches provider distribution by governorate.
 */
export async function getGovStats() {
  const { data, error } = await supabase
    .from("dashboard_offers_count_by_gov")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetches top providers based on scan activity.
 */
export async function getTopProviders() {
  const { data, error } = await supabase
    .from("dashboard_provider_view")
    .select("*, provider(Name, NameAr, ImageUrl)") // Join to get names
    .order("TotalScans", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data;
}

export async function getRevenueStats() {
  const { data, error } = await supabase
    .from("view_monthly_revenue")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}

export async function getScanStats() {
  const { data, error } = await supabase
    .from("view_daily_scans")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}