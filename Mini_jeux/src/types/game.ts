export type Difficulty = "easy" | "medium" | "hard" | "end";

export interface Level {
  game: string;
  difficulty: Difficulty;
  title: string;
}

export type GameStarter = (container: HTMLElement, onFinish: () => void) => void;

export interface LoadGameResult {
  title: string;
  finished: boolean;
  error: string | null;
}

export interface StarBurst {
  id: string;
  originX: number;
  originY: number;
}

export type AppScreen = "home" | "play";
