import { supabase } from "../lib/supabase";

// --- GROUPS ---

export async function getPackageGroups() {
  const { data, error } = await supabase
    .from("ViewPackageCodeGroup")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createPackageGroup({ name, packageId, count, netPrice }) {
  // 1. Create the Group
  const { data: group, error: groupError } = await supabase
    .from("package_code_group")
    .insert([{ 
      Name: name, 
      PackageID: packageId, 
      CodeCount: count, 
      NetPrice: netPrice 
    }])
    .select()
    .single();

  if (groupError) throw new Error(groupError.message);

  return group;
}

export async function deletePackageGroup(id) {
  const { error } = await supabase.from("package_code_group").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- CODES (Inside a Group) ---

export async function insertCodes(codes) {
  // codes is an array of objects: { GroupID, PackageID, Code }
  const { error } = await supabase
    .from("package_code")
    .insert(codes);

  if (error) throw new Error(error.message);
}

export async function getGroupCodes(groupId) {
  const { data, error } = await supabase
    .from("package_code")
    .select("*")
    .eq("GroupID", groupId)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}