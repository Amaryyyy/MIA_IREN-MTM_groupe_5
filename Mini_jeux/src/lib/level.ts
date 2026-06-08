import type { Level } from "@/types/game";

//Test Deploy Supabase

const levels: Level[] = [
//1
{ game: "game1", difficulty: "easy", title: "Reverse Maze" },

//2
{ game: "game31", difficulty: "hard", title: "Linear Drop" },

//3
{ game: "game8", difficulty: "hard", title: "Complementaries" },

//4
{ game: "game6", difficulty: "hard", title: "Loop Rebus" },

//5
{ game: "game18", difficulty: "hard", title: "Binary Blast" },

//6
{ game: "game25", difficulty: "hard", title: "API Assault" },

//7
{ game: "game10", difficulty: "hard", title: "Cyber Nexus" },

//8
{ game: "game2", difficulty: "hard", title: "Color Hack" },

//9
{ game: "game20", difficulty: "easy", title: "Slot the Darts" },

//10
{ game: "game26", difficulty: "hard", title: "Color Chaos" },

//11
{ game: "game21", difficulty: "hard", title: "Debugging Duel" },

//12
{ game: "game12", difficulty: "hard", title: "Pixel Peril" },

//13
{ game: "game15", difficulty: "hard", title: "Fast Cars" },

//14
{ game: "TransitionMedium", difficulty: "medium", title: "Transition Medium" },

//15
{ game: "game4", difficulty: "medium", title: "Mysterious Enigma" },

//16
{ game: "game38", difficulty: "hard", title: "Cyber Diavola" },

//17
{ game: "game7", difficulty: "hard", title: "Polary Memory" },

//18
{ game: "game28", difficulty: "hard", title: "TriadCode" },

//19
{ game: "game5", difficulty: "medium", title: "Strange Symbols" },

//20
{ game: "game35", difficulty: "hard", title: "Labyrinthe Neural" },

//21
{ game: "game39", difficulty: "hard", title: "Ice Stack Deluxe" },

//22
{ game: "game29", difficulty: "hard", title: "LetterPulse" },

//23
{ game: "game36", difficulty: "hard", title: "Pac Trap" },

//24
{ game: "game33", difficulty: "hard", title: "Retro Sequence" },

//25
{ game: "game24", difficulty: "hard", title: "Framework Frenzy" },

//26
{ game: "game16", difficulty: "hard", title: "Galaxy Seum" },

//27
{ game: "game32", difficulty: "hard", title: "Silent Break" },

//28
{ game: "TransitionHard", difficulty: "hard", title: "Transition Hard" },

//29
{ game: "game3", difficulty: "easy", title: "Invisible Maze" },

//30
{ game: "game19", difficulty: "hard", title: "Logic Mirrors" },

//31
{ game: "game27", difficulty: "hard", title: "Digit Riddle" },

//32
{ game: "game9", difficulty: "hard", title: "Matchy Matchy" },

//33
{ game: "game34", difficulty: "hard", title: "End of Reason" },

//34
{ game: "game14", difficulty: "hard", title: "Giant Snake" },

//35
{ game: "game40", difficulty: "hard", title: "Chromix" },

//36
{ game: "game13", difficulty: "hard", title: "Escape" },

//37
{ game: "game23", difficulty: "hard", title: "Compiler Chaos" },

//38
{ game: "game22", difficulty: "hard", title: "Syntax Siege" },

//39
{ game: "game17", difficulty: "hard", title: "Prime Stickler" },

//40
{ game: "game37", difficulty: "hard", title: "Neo Snake" },

//41
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