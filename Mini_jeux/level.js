// Level management module

const levels = [
//1
  { game: 'game1', difficulty: 'easy', title: 'Reverse Maze'},

//2
  { game: 'game31', difficulty: 'hard', title: 'Linear Drop' }, 
  
//3
  { game: 'game8', difficulty: 'hard', title: 'Complementaries' },  
  
//4
  { game: 'game6', difficulty: 'hard', title: 'Loop Rebus' }, 
  
//5
  { game: 'game18', difficulty: 'hard', title: 'Binary Blast' },

//6
  { game: 'game25', difficulty: 'hard', title: 'API Assault' },
  
//7
  { game: 'game10', difficulty: 'hard', title: 'Cyber Nexus' },

//8
  { game: 'game2', difficulty: 'easy', title: 'Color Hack'},

//9
  { game: 'game20', difficulty: 'hard', title: 'Slot the Darts' },

//10
  { game: 'game26', difficulty: 'hard', title: 'Crazy Draft' },

//11
  { game: 'game21', difficulty: 'hard', title: 'Debugging Duel' },

//12
  { game: 'game12', difficulty: 'hard', title: 'Pixel Peril' },

//13
  { game: 'game13', difficulty: 'hard', title: 'Escape' },

//14
  { game: 'game14', difficulty: 'hard', title: 'Giant Snake' },

//15
  { game: 'game15', difficulty: 'hard', title: 'Fast Cars' },

//16
  { game: 'game16', difficulty: 'hard', title: 'Galaxy Seum' },

//17
  { game: 'game17', difficulty: 'hard', title: 'Prime Stickler' },

//18
  { game: 'game4', difficulty: 'medium', title: 'Mysterious Enigma'},
  
//19
  { game: 'game19', difficulty: 'hard', title: 'Logic Mirrors' },

//20
  { game: 'game11', difficulty: 'hard', title: 'Digital Dawn' },

//21
  { game: 'game5', difficulty: 'medium', title: 'Strange Symbols'},
  
//22
  { game: 'game22', difficulty: 'hard', title: 'Syntax Siege' },

//23
  { game: 'game23', difficulty: 'hard', title: 'Compiler Chaos' },

//24
  { game: 'game24', difficulty: 'hard', title: 'Framework Frenzy' },

//25
  { game: 'game3', difficulty: 'easy', title: 'Invisible Maze'},
  
//26
  { game: 'game9', difficulty: 'hard', title: 'Matchy Matchy' },

//27
  { game: 'game27', difficulty: 'hard', title: 'Digit Riddle' },

//28
  { game: 'game28', difficulty: 'hard', title: 'TriadCode' },

//29
  { game: 'game29', difficulty: 'hard', title: 'LetterPulse' },

//30
  { game: 'game30', difficulty: 'hard', title: 'The Unpattern' },

//31
  { game: 'game7', difficulty: 'hard', title: 'Polary Memory' },
  
//32
  { game: 'game32', difficulty: 'hard', title: 'Silent Break' },

//33
  { game: 'game33', difficulty: 'hard', title: 'Retro Descent' },

//34
  { game: 'game34', difficulty: 'hard', title: 'End of Reason' },

//35
  { game: 'game35', difficulty: 'hard', title: 'Labyrinthe Neural' },

//36
  { game: 'game36', difficulty: 'hard', title: 'Pac Trap' },

//37
  { game: 'game37', difficulty: 'hard', title: 'Neo Snake' },

//38
  { game: 'game38', difficulty: 'hard', title: 'Cyber Diavola' },

//39
  { game: 'game39', difficulty: 'hard', title: 'Ice Stack Deluxe' },

//40
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
