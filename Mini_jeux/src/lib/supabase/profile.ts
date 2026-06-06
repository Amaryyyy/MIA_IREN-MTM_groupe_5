import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function createProfile(
  userId: string,
  username: string,
  avatarUrl: string
): Promise<Profile> {
  if (!supabase) throw new Error("Supabase non configuré");

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: username.trim(),
      avatar_url: avatarUrl,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
): Promise<Profile> {
  if (!supabase) throw new Error("Supabase non configuré");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}
