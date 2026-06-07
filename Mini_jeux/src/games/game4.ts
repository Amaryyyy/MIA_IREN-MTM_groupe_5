// @ts-nocheck
import {
  createGameTitle,
  createRebusDisplay,
  createInputField,
  createValidationButton,
  createFeedbackDiv,
  setFeedback,
  errorMessages
} from "@/lib/gameInterface";

import { gameManager } from "@/lib/gameCleanup";

export function startGame4(container, onFinish) {
  container.innerHTML = "";

  // Police Orbitron
  const orbitronFont = document.createElement("link");
  orbitronFont.rel = "stylesheet";
  orbitronFont.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";

  document.head.appendChild(orbitronFont);

  const title = createGameTitle("Déchiffre l'énigme !");
  title.style.fontFamily = "Orbitron, sans-serif";
  title.style.color = "#FFEAF8";

  title.style.textShadow = `
    0 0 4px rgba(255,255,255,0.7),
    0 0 8px rgba(255,192,203,0.35)
  `;

  const rebusDiv = createRebusDisplay("🐄🪺💧🫏");

  rebusDiv.style.fontFamily =
    "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif";

  const input = createInputField();
  input.style.fontFamily = "Orbitron, sans-serif";

  const button = createValidationButton();
  button.style.fontFamily = "Orbitron, sans-serif";

  const feedbackDiv = createFeedbackDiv();
  feedbackDiv.style.fontFamily = "Orbitron, sans-serif";

  container.appendChild(title);
  container.appendChild(rebusDiv);
  container.appendChild(input);
  container.appendChild(button);
  container.appendChild(feedbackDiv);

  let attempts = 0;

  function checkAnswer() {
    const answer = input.value.toLowerCase().trim();

    if (answer === "anonyme") {
      setFeedback(feedbackDiv, true, "✓ Bien joué !");

      setTimeout(() => {
        onFinish();
      }, 500);

    } else {
      setFeedback(
        feedbackDiv,
        false,
        errorMessages[attempts % errorMessages.length]
      );

      attempts++;
    }
  }

  button.addEventListener("click", checkAnswer);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
}