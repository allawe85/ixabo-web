import { supabase } from "../lib/supabase";

/**
 * Fetches all notification campaigns.
 * @returns {Promise<Array>}
 */
export async function getNotificationCampaigns() {
  const { data, error } = await supabase
    .from("notification_campaign")
    .select("*")
    .order("id", { ascending: false }); // Newest first

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Creates a new notification campaign.
 * @param {Object} campaign
 */
export async function createNotificationCampaign(campaign) {
  const { data, error } = await supabase
    .from("notification_campaign")
    .insert([campaign])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes a campaign (Optional, usually better to keep history).
 */
export async function deleteNotificationCampaign(id) {
  const { error } = await supabase
    .from("notification_campaign")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}