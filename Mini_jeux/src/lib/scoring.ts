import type { Difficulty } from "@/types/game";

const BASE_SCORE: Record<Difficulty, number> = {
  easy: 100,
  medium: 250,
  hard: 500,
  end: 50,
};

export function calculateScore(
  timeSeconds: number,
  attempts: number,
  difficulty: Difficulty
): number {
  const baseScore = BASE_SCORE[difficulty] ?? 100;
  const timePenalty = Math.max(0, timeSeconds - 30) * 2;
  const attemptPenalty = (attempts - 1) * 20;
  return Math.max(0, baseScore - timePenalty - attemptPenalty);
}
