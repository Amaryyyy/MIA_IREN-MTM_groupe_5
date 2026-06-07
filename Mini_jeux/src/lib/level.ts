import type { Level } from "@/types/game";

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
{ game: "game20", difficulty: "hard", title: "Slot the Darts" },

//9
{ game: "game26", difficulty: "hard", title: "Crazy Draft" },

//10
{ game: "game21", difficulty: "hard", title: "Debugging Duel" },

//11
{ game: "game12", difficulty: "hard", title: "Pixel Peril" },

//12
{ game: "game15", difficulty: "hard", title: "Fast Cars" },

//13
{ game: "TransitionMedium", difficulty: "medium", title: "Transition Medium" },

//14
{ game: "game4", difficulty: "medium", title: "Mysterious Enigma" },

//15
{ game: "game38", difficulty: "hard", title: "Cyber Diavola" },

//16
{ game: "game7", difficulty: "hard", title: "Polary Memory" },

//17
{ game: "game28", difficulty: "hard", title: "TriadCode" },

//18
{ game: "game5", difficulty: "medium", title: "Strange Symbols" },

//19
{ game: "game35", difficulty: "hard", title: "Labyrinthe Neural" },

//20
{ game: "game39", difficulty: "hard", title: "Ice Stack Deluxe" },

//21
{ game: "game29", difficulty: "hard", title: "LetterPulse" },

//22
{ game: "game36", difficulty: "hard", title: "Pac Trap" },

//23
{ game: "game33", difficulty: "hard", title: "Retro Descent" },

//24
{ game: "game24", difficulty: "hard", title: "Framework Frenzy" },

//25
{ game: "game16", difficulty: "hard", title: "Galaxy Seum" },

//26
{ game: "game32", difficulty: "hard", title: "Silent Break" },

//27
{ game: "TransitionHard", difficulty: "hard", title: "Transition Hard" },

//28
{ game: "game3", difficulty: "easy", title: "Invisible Maze" },

//29
{ game: "game19", difficulty: "hard", title: "Logic Mirrors" },

//30
{ game: "game27", difficulty: "hard", title: "Digit Riddle" },

//31
{ game: "game9", difficulty: "hard", title: "Matchy Matchy" },

//32
{ game: "game34", difficulty: "hard", title: "End of Reason" },

//33
{ game: "game14", difficulty: "hard", title: "Giant Snake" },

//34
{ game: "game40", difficulty: "hard", title: "Chromix" },

//35
{ game: "game13", difficulty: "hard", title: "Escape" },

//36
{ game: "game23", difficulty: "hard", title: "Compiler Chaos" },

//37
{ game: "game22", difficulty: "hard", title: "Syntax Siege" },

//38
{ game: "game17", difficulty: "hard", title: "Prime Stickler" },

//39
{ game: "game37", difficulty: "hard", title: "Neo Snake" },

//40
{ game: "game30", difficulty: "hard", title: "The Unpattern" },

//41
{ game: "game11", difficulty: "hard", title: "Digital Dawn" },

//42
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
