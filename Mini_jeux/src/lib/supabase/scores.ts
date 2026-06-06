import { calculateScore } from "@/lib/scoring";
import { getAllLevels } from "@/lib/level";
import { supabase } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/types/database";
import type { Difficulty } from "@/types/game";

export async function submitLevelScore(
  userId: string,
  levelIndex: number,
  timeSeconds: number,
  attempts: number
): Promise<number> {
  if (!supabase) return 0;

  const levels = getAllLevels();
  const level = levels[levelIndex];
  const difficulty = (level?.difficulty ?? "easy") as Difficulty;
  const score = calculateScore(timeSeconds, attempts, difficulty);

  const { error } = await supabase.from("scores").insert({
    user_id: userId,
    level_index: levelIndex,
    score,
    time_seconds: timeSeconds,
    attempts,
  });

  if (error) throw error;
  return score;
}

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, username, avatar_url, total_score")
    .order("total_score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}

export { calculateScore };
