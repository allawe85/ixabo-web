import { supabase } from "../lib/supabase";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {File} file - The file object from the input.
 * @param {string} bucket - Bucket name (default: 'ixaboimgs').
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export async function uploadImage(file, bucket = "ixaboimgs") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`; // Unique name based on timestamp
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Get Public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}