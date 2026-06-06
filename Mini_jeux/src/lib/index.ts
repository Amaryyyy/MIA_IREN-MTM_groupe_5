export type { DecorativeImageLayout } from "@/types/decoration";
export type {
  AppScreen,
  Difficulty,
  GameStarter,
  Level,
  LoadGameResult,
  StarBurst,
} from "@/types/game";

export { getAllLevels, getLevelTitle, getNextLevel } from "@/lib/level";
export { loadGame } from "@/lib/loadGame";
export { gameManager } from "@/lib/gameCleanup";
