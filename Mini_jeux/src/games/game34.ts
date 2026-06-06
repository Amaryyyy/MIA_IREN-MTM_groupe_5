// @ts-nocheck
import { createInputField, createValidationButton, createFeedbackDiv, setFeedback } from "@/lib/gameInterface";

export function startGame34(container, onFinish) {
  const levels = [
    {
      question: "Dernier niveau : il n'y a pas de logique !",
      answer: "il n'y a pas de logique",
      hint: "Fais confiance à ton intuition finale."
    }
  ];

  container.innerHTML = "";

  // Charger la police ballon uniquement pour ce jeu
  const balloonFont = document.createElement("link");
  balloonFont.rel = "stylesheet";
  balloonFont.href = "https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap";
  document.head.appendChild(balloonFont);

  // Charger Orbitron pour le reste
  const orbitronFont = document.createElement("link");
  orbitronFont.rel = "stylesheet";
  orbitronFont.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
  document.head.appendChild(orbitronFont);

  // --- TITRE ---
  const title = document.createElement("h2");
  title.textContent = "Pattern Breaker";
  title.style.textAlign = "center";
  title.style.color = "#836fff";
  title.style.marginBottom = "16px";
  title.style.fontFamily = "Orbitron, sans-serif";

  // --- QUESTION ---
  const question = document.createElement("p");
  question.id = "pb-question";
  question.style.textAlign = "center";
  question.style.fontSize = "28px";
  question.style.margin = "12px 0";

  // 👉 Police ballon dorée pour la phrase finale
  question.style.fontFamily = "'Luckiest Guy', cursive";
  question.style.color = "#ffd700";
  question.style.textShadow = "0 0 10px #ffcc00, 0 0 20px #ff9900";

  // --- INPUT / BOUTON / FEEDBACK ---
  const input = createInputField();
  input.style.fontFamily = "Orbitron, sans-serif";

  const button = createValidationButton();
  button.style.fontFamily = "Orbitron, sans-serif";

  const feedback = createFeedbackDiv();
  feedback.style.fontFamily = "Orbitron, sans-serif";

  let currentLevel = 0;
  let attempts = 0;

  function loadLevel() {
    const level = levels[currentLevel];
    question.textContent = level.question;
    input.value = "";
    attempts = 0;

    // Feedback en Orbitron
    setFeedback(feedback, true, "Bonne chance !");
    feedback.style.fontFamily = "Orbitron, sans-serif";

    input.focus();
  }

  function showProgressHint() {
    if (attempts === 2) {
      setFeedback(feedback, false, `Indice : ${levels[currentLevel].hint}`);
    } else if (attempts === 4) {
      setFeedback(feedback, false, "Un autre indice : relis bien l'énoncé, ce n'est pas toujours la même règle.");
    } else {
      const messages = [
        "✗ Essaie encore.",
        "✗ Tiens bon, c'est intéressant !",
        "✗ Petit effort de plus...",
        "✗ Là c'est le moment d'un gros break mental."
      ];
      setFeedback(feedback, false, messages[Math.min(attempts - 1, messages.length - 1)]);
    }
  }

  function checkAnswer() {
    const userInput = input.value.trim().toLowerCase();
    const expected = levels[currentLevel].answer.trim().toLowerCase();

    attempts++;

    if (userInput === "") {
      setFeedback(feedback, false, "Tu dois saisir une réponse.");
      return;
    }

    if (userInput === expected) {
      setFeedback(feedback, true, "🎉 Tu as trouvé la dernière règle cachée !");
      setTimeout(() => {
        alert("Wow ! Pattern Breaker complété 🎉");
        onFinish();
      }, 250);
      return;
    }

    showProgressHint();
  }

  button.addEventListener("click", checkAnswer);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer();
    }
  });

  container.appendChild(title);
  container.appendChild(question);
  container.appendChild(input);
  container.appendChild(button);
  container.appendChild(feedback);

  loadLevel();
}