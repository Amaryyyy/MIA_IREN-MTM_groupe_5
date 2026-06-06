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
  { game: 'game15', difficulty: 'hard', title: 'Fast Cars' },

//14
  { game: 'game4', difficulty: 'medium', title: 'Mysterious Enigma'},

//15
  { game: 'game38', difficulty: 'hard', title: 'Cyber Diavola' },
  
//16
  { game: 'game7', difficulty: 'hard', title: 'Polary Memory' },

//17
  { game: 'game28', difficulty: 'hard', title: 'TriadCode' },

//18
  { game: 'game5', difficulty: 'medium', title: 'Strange Symbols'},
  
//19
  { game: 'game35', difficulty: 'hard', title: 'Labyrinthe Neural' },

//20
  { game: 'game39', difficulty: 'hard', title: 'Ice Stack Deluxe' },

//21
  { game: 'game29', difficulty: 'hard', title: 'LetterPulse' },
  
//22
  { game: 'game36', difficulty: 'hard', title: 'Pac Trap' },

//23
  { game: 'game33', difficulty: 'hard', title: 'Retro Descent' },

//24
  { game: 'game24', difficulty: 'hard', title: 'Framework Frenzy' },

//25
  { game: 'game16', difficulty: 'hard', title: 'Galaxy Seum' },
  
//26
  { game: 'game32', difficulty: 'hard', title: 'Silent Break' },

//27
  { game: 'game3', difficulty: 'easy', title: 'Invisible Maze'}, 

//28
  { game: 'game19', difficulty: 'hard', title: 'Logic Mirrors' },

//29
  { game: 'game27', difficulty: 'hard', title: 'Digit Riddle' },
 
//30
  { game: 'game9', difficulty: 'hard', title: 'Matchy Matchy' },

//31
  { game: 'game34', difficulty: 'hard', title: 'End of Reason' },
  
//32
  { game: 'game14', difficulty: 'hard', title: 'Giant Snake' },

//33
  { game: 'game40', difficulty: 'hard', title: 'Chromix' },
 
//34
  { game: 'game13', difficulty: 'hard', title: 'Escape' },

//35
  { game: 'game23', difficulty: 'hard', title: 'Compiler Chaos' },

//36
  { game: 'game22', difficulty: 'hard', title: 'Syntax Siege' },

//37
  { game: 'game17', difficulty: 'hard', title: 'Prime Stickler' },

//38
  { game: 'game37', difficulty: 'hard', title: 'Neo Snake' },
 
//39
  { game: 'game30', difficulty: 'hard', title: 'The Unpattern' },

//40
  { game: 'game11', difficulty: 'hard', title: 'Digital Dawn' },
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
