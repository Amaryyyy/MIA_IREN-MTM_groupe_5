import type { Level } from "@/types/game";

const levels: Level[] = [
  { game: "game1", difficulty: "easy", title: "Reverse Maze" },
  { game: "game31", difficulty: "hard", title: "Linear Drop" },
  { game: "game8", difficulty: "hard", title: "Complementaries" },
  { game: "game6", difficulty: "hard", title: "Loop Rebus" },
  { game: "game18", difficulty: "hard", title: "Binary Blast" },
  { game: "game25", difficulty: "hard", title: "API Assault" },
  { game: "game10", difficulty: "hard", title: "Cyber Nexus" },
  { game: "game2", difficulty: "easy", title: "Color Hack" },
  { game: "game20", difficulty: "hard", title: "Slot the Darts" },
  { game: "game26", difficulty: "hard", title: "Crazy Draft" },
  { game: "game21", difficulty: "hard", title: "Debugging Duel" },
  { game: "game12", difficulty: "hard", title: "Pixel Peril" },
  { game: "game15", difficulty: "hard", title: "Fast Cars" },
  { game: "TransitionMedium", difficulty: "medium", title: "Transition Medium" },
  { game: "game4", difficulty: "medium", title: "Mysterious Enigma" },
  { game: "game38", difficulty: "hard", title: "Cyber Diavola" },
  { game: "game7", difficulty: "hard", title: "Polary Memory" },
  { game: "game28", difficulty: "hard", title: "TriadCode" },
  { game: "game5", difficulty: "medium", title: "Strange Symbols" },
  { game: "game35", difficulty: "hard", title: "Labyrinthe Neural" },
  { game: "game39", difficulty: "hard", title: "Ice Stack Deluxe" },
  { game: "game29", difficulty: "hard", title: "LetterPulse" },
  { game: "game36", difficulty: "hard", title: "Pac Trap" },
  { game: "game33", difficulty: "hard", title: "Retro Descent" },
  { game: "game24", difficulty: "hard", title: "Framework Frenzy" },
  { game: "game16", difficulty: "hard", title: "Galaxy Seum" },
  { game: "game32", difficulty: "hard", title: "Silent Break" },
  { game: "TransitionHard", difficulty: "hard", title: "Transition Hard" },
  { game: "game3", difficulty: "easy", title: "Invisible Maze" },
  { game: "game19", difficulty: "hard", title: "Logic Mirrors" },
  { game: "game27", difficulty: "hard", title: "Digit Riddle" },
  { game: "game9", difficulty: "hard", title: "Matchy Matchy" },
  { game: "game34", difficulty: "hard", title: "End of Reason" },
  { game: "game14", difficulty: "hard", title: "Giant Snake" },
  { game: "game40", difficulty: "hard", title: "Chromix" },
  { game: "game13", difficulty: "hard", title: "Escape" },
  { game: "game23", difficulty: "hard", title: "Compiler Chaos" },
  { game: "game22", difficulty: "hard", title: "Syntax Siege" },
  { game: "game17", difficulty: "hard", title: "Prime Stickler" },
  { game: "game37", difficulty: "hard", title: "Neo Snake" },
  { game: "game30", difficulty: "hard", title: "The Unpattern" },
  { game: "game11", difficulty: "hard", title: "Digital Dawn" },
  { game: "TransitionEnd", difficulty: "end", title: "Fin du Jeu" },
];

export function getNextLevel(currentLevelIndex: number): Level | null {
  return levels[currentLevelIndex + 1] ?? null;
}

export function getAllLevels(): Level[] {
  return levels;
}

export function getLevelTitle(index: number): string | null {
  const lvl = levels[index];
  if (!lvl) return null;
  return `Game ${index + 1} - ${lvl.title || `titre du jeu ${index + 1}`}`;
}
