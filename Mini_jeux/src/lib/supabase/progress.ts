import { supabase } from "@/lib/supabase/client";

export async function fetchUserProgress(userId: string): Promise<number> {
  if (!supabase) return 0;

  const { data, error } = await supabase
    .from("user_progress")
    .select("current_level_index")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  const row = data as { current_level_index?: number } | null;
  return row?.current_level_index ?? 0;
}

export async function saveUserProgress(
  userId: string,
  nextLevelIndex: number
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      current_level_index: nextLevelIndex,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
}
