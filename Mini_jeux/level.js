// Level management module

const levels = [
  { game: 'game25', difficulty: 'easy', title: 'Reverse Maze'},
  { game: 'game2', difficulty: 'easy', title: 'Color Hack'},
  { game: 'game3', difficulty: 'easy', title: 'Invisible Maze'},
  { game: 'game4', difficulty: 'medium', title: 'Mysterious Enigma'},
  { game: 'game5', difficulty: 'medium', title: 'Strange Symbols'},
  { game: 'game6', difficulty: 'hard', title: 'Loop Rebus' },
  { game: 'game7', difficulty: 'hard', title: 'Polary Memory' },
  { game: 'game8', difficulty: 'hard', title: 'Complementaries' },
  { game: 'game9', difficulty: 'hard', title: 'Matchy Matchy' },
  { game: 'game10', difficulty: 'hard', title: 'Cyber Nexus' },
  { game: 'game11', difficulty: 'hard', title: 'Digital Dawn' },
  { game: 'game12', difficulty: 'hard', title: 'Pixel Peril' },
  { game: 'game13', difficulty: 'hard', title: 'Escape' },
  { game: 'game14', difficulty: 'hard', title: 'Giant Snake' },
  { game: 'game15', difficulty: 'hard', title: 'Fast Cars' },
  { game: 'game16', difficulty: 'hard', title: 'Galaxy Seum' },
  { game: 'game17', difficulty: 'hard', title: 'Prime Stickler' },
  { game: 'game18', difficulty: 'hard', title: 'Binary Blast' },
  { game: 'game19', difficulty: 'hard', title: 'Logic Mirrors' },
  { game: 'game20', difficulty: 'hard', title: 'Slot the Darts' },
  { game: 'game21', difficulty: 'hard', title: 'Debugging Duel' },
  { game: 'game22', difficulty: 'hard', title: 'Syntax Siege' },
  { game: 'game23', difficulty: 'hard', title: 'Compiler Chaos' },
  { game: 'game24', difficulty: 'hard', title: 'Framework Frenzy' },
  { game: 'game25', difficulty: 'hard', title: 'API Assault' },
  { game: 'game26', difficulty: 'hard', title: 'Crazy Draft' },
  { game: 'game27', difficulty: 'hard', title: 'Game 27' },
  { game: 'game28', difficulty: 'hard', title: 'Game 28' },
  { game: 'game29', difficulty: 'hard', title: 'Game 29' },
  { game: 'game30', difficulty: 'hard', title: 'Game 30' },
  { game: 'game31', difficulty: 'hard', title: 'Game 31' },
  { game: 'game32', difficulty: 'hard', title: 'Game 32' },
  { game: 'game33', difficulty: 'hard', title: 'Game 33' },
  { game: 'game34', difficulty: 'hard', title: 'Game 34' },
  { game: 'game35', difficulty: 'hard', title: 'Game 35' },
  { game: 'game36', difficulty: 'hard', title: 'Game 36' },
  { game: 'game37', difficulty: 'hard', title: 'Game 37' },
  { game: 'game38', difficulty: 'hard', title: 'Game 38' },
  { game: 'game39', difficulty: 'hard', title: 'Ice Stack' },
  { game: 'game40', difficulty: 'hard', title: 'Chromix' },
];

// Get the next level
export function getNextLevel(currentLevelIndex) {
  return levels[currentLevelIndex + 1] || null;
}

// Get all levels
export function getAllLevels() {
  return levels;
}

// New helper : retourne le titre affichable d'un niveau
export function getLevelTitle(index) {
 const lvl = levels[index];
 if (!lvl) return null;
 return `Game ${index + 1} - ${lvl.title || `titre du jeu ${index + 1}`}`;
}
