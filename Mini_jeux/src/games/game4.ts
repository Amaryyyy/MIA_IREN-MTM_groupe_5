// @ts-nocheck
import { createGameTitle, createRebusDisplay, createInputField, createValidationButton, createFeedbackDiv, setFeedback, errorMessages } from "@/lib/gameInterface";
import { gameManager } from "@/lib/gameCleanup";

export function startGame4(container, onFinish) {
    container.innerHTML = "";

    const title = createGameTitle("Déchiffre l'énigme !");
    const rebusDiv = createRebusDisplay("🐄🪺💧🫏");
    rebusDiv.style.fontFamily =
    "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif";
    const input = createInputField();
    const button = createValidationButton();
    const feedbackDiv = createFeedbackDiv();

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
        setFeedback(feedbackDiv, false, errorMessages[attempts % errorMessages.length]);
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