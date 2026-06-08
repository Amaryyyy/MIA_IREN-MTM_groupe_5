// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";
import { createMemoryGame } from "./game7.js";



// Paires du jeu 9
export function startGame9(container, onFinish) {
  const pairs = [
    { id: "saturn-black-shape-with-stars-around", pair: "cat" },
    { id: "mark", pair: "moon" },
    { id: "flower yellow", pair: "sun" },
    { id: "nature", pair: "pink-cosmos" },
    { id: "wave", pair: "butterfly" },
    { id: "strawberry", pair: "fruit" },
    { id: "plant", pair: "sea" },
  ];

  const intruders = [
    { id: "anise", pair: "anise" },
    { id: "flower purple", pair: "flower purple" },
  ];

  // Révéler les deux cartes intrus en Rouge une fois que toutes les paires sont trouvées
  function revealIntruders(cards, cardElementsMap) {
    cards.forEach((cardData) => {
      if (cardData.isIntruder) {
        const cardInfo = cardElementsMap.get(cardData.id);
        
        if (cardInfo) {
          const { card, cardInner } = cardInfo;
          
          // Retourner la carte
          cardInner.style.transform = "rotateY(180deg)";
          
          // Appliquer la lueur ROUGE au cardInner (comme le VERT pour les paires)
          cardInner.style.boxShadow = "0 0 35px rgba(255, 0, 0, 0.8)";
          
          // Appliquer une légère échelle comme pour les paires
          cardInner.style.transform = "rotateY(180deg) scale(0.95)";
        }
      }
    });
    
  // Message de victoire
const winMsg = document.createElement("div");

winMsg.textContent =
  "🎉 Bravo ! Les cartes rouges étaient les intrus.";

winMsg.style.marginTop = "18px";
winMsg.style.fontFamily = "Orbitron, sans-serif";
winMsg.style.fontSize = "20px";
winMsg.style.color = "#22c55e";
winMsg.style.textAlign = "center";
winMsg.style.textShadow =
  "0 0 10px rgba(34,197,94,0.8)";

container.appendChild(winMsg);

setTimeout(() => {
  onFinish();
}, 1800);
  }

  // Passer la fonction de révélation comme callback
  createMemoryGame(container, onFinish, pairs, intruders, revealIntruders);
}
