import {
  createGameTitle,
  createFeedbackDiv,
  setFeedback
} from "../gameInterface.js";

import { gameManager } from "../gameCleanup.js";

export function startGame2(container, onFinish) {

  // =========================
  // START GAME
  // =========================
  gameManager.startGame();

  container.innerHTML = "";

  // =========================
  // CONTAINER
  // =========================
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  // =========================
  // TITLE HIDDEN
  // =========================
  const title = createGameTitle("");
  title.style.display = "none";

  const feedbackDiv = createFeedbackDiv();

  container.appendChild(title);

  // =========================
  // RESPONSIVE VALUES
  // =========================
  const isMobile =
    window.innerWidth < 768;

  const boxSize = Math.min(
    window.innerWidth * 0.13,
    75
  );

  const hintSize = Math.min(
    window.innerWidth * 0.10,
    50
  );

  const gapSize =
    isMobile ? 12 : 20;

  // =========================
  // GAME DATA
  // =========================
  const colors = [
    "red",
    "blue",
    "green",
    "yellow"
  ];

  const keys = [
    "z",
    "s",
    "e",
    "a"
  ];

  const codeSequence = [
    "red",
    "blue",
    "green",
    "yellow"
  ];

  let playerIndex = 0;

  // =========================
  // GAME WRAPPER
  // =========================
  const gameWrapper =
    document.createElement("div");

  gameWrapper.style.display = "flex";

  gameWrapper.style.flexDirection =
    "column";

  gameWrapper.style.alignItems =
    "center";

  gameWrapper.style.justifyContent =
    "center";

  gameWrapper.style.width = "100%";

  gameWrapper.style.maxWidth = "900px";

  gameWrapper.style.padding = "20px";

  gameWrapper.style.boxSizing =
    "border-box";

  gameWrapper.style.gap =
    isMobile ? "25px" : "40px";

  container.appendChild(gameWrapper);

  // =========================
  // SEQUENCE ROW
  // =========================
  const sequenceDiv =
    document.createElement("div");

  sequenceDiv.style.display = "flex";

  sequenceDiv.style.justifyContent =
    "center";

  sequenceDiv.style.alignItems =
    "center";

  sequenceDiv.style.flexWrap = "wrap";

  sequenceDiv.style.gap =
    `${gapSize}px`;

  gameWrapper.appendChild(sequenceDiv);

  // =========================
  // HINTS CONTAINER
  // =========================
  const hintsContainer =
    document.createElement("div");

  hintsContainer.style.display =
    "flex";

  hintsContainer.style.justifyContent =
    "center";

  hintsContainer.style.alignItems =
    "center";

  hintsContainer.style.flexWrap =
    "wrap";

  hintsContainer.style.gap =
    `${gapSize}px`;

  hintsContainer.style.padding =
    isMobile
      ? "12px 18px"
      : "15px 30px";

  hintsContainer.style.background =
    "rgba(255,255,255,0.03)";

  hintsContainer.style.borderRadius =
    "50px";

  hintsContainer.style.border =
    "1px solid rgba(255,255,255,0.1)";

  // NEON
  hintsContainer.style.boxShadow = `
    0 0 25px rgba(0,170,255,0.10),
    0 0 50px rgba(140,0,255,0.08)
  `;

  gameWrapper.appendChild(hintsContainer);

  // =========================
  // BOXES
  // =========================
  const boxes =
    codeSequence.map(() => {

      const box =
        document.createElement("div");

      box.style.width =
        `${boxSize}px`;

      box.style.height =
        `${boxSize}px`;

      box.style.background =
        "#000000";

      box.style.border =
        "1px solid rgba(255,255,255,0.2)";

      box.style.borderRadius =
        "12px";

      box.style.transition = `
        all 0.4s
        cubic-bezier(
          0.175,
          0.885,
          0.32,
          1.275
        )
      `;

      // Glow discret
      box.style.boxShadow = `
        0 0 15px rgba(0,170,255,0.05)
      `;

      sequenceDiv.appendChild(box);

      return box;
    });

  // =========================
  // SHUFFLED HINTS
  // =========================
  const shuffledKeys =
    [...keys].sort(
      () => Math.random() - 0.5
    );

  shuffledKeys.forEach((k) => {

    const hint =
      document.createElement("div");

    hint.style.width =
      `${hintSize}px`;

    hint.style.height =
      `${hintSize}px`;

    hint.style.display = "flex";

    hint.style.alignItems =
      "center";

    hint.style.justifyContent =
      "center";

    hint.style.fontFamily =
      "'Courier New', monospace";

    hint.style.fontSize =
      isMobile ? "15px" : "18px";

    hint.style.fontWeight =
      "bold";

    hint.style.color = "white";

    hint.style.border =
      "1px solid rgba(255,255,255,0.3)";

    hint.style.borderRadius =
      "50%";

    hint.style.background =
      "rgba(255,255,255,0.03)";

    hint.style.boxShadow = `
      0 0 20px rgba(140,0,255,0.08)
    `;

    hint.innerText =
      k.toUpperCase();

    hintsContainer.appendChild(hint);
  });

  gameWrapper.appendChild(feedbackDiv);

  // =========================
  // INPUT HANDLER
  // =========================
  function handleKey(e) {

    const key =
      e.key.toLowerCase();

    if (!keys.includes(key)) {
      return;
    }

    const expectedColor =
      codeSequence[playerIndex];

    const expectedKey =
      keys[
        colors.indexOf(
          expectedColor
        )
      ];

    const currentBox =
      boxes[playerIndex];

    // =========================
    // SUCCESS
    // =========================
    if (key === expectedKey) {

      currentBox.style.background =
        expectedColor;

      currentBox.style.borderColor =
        "#ffffff";

      currentBox.style.boxShadow = `
        0 0 10px #ffffff,
        0 0 30px ${expectedColor}
      `;

      currentBox.style.transform =
        "scale(1.1) translateY(-5px)";

      setFeedback(
        feedbackDiv,
        true,
        "✓ ACCÈS PARTIEL"
      );

      playerIndex++;

      // =========================
      // WIN
      // =========================
      if (
        playerIndex ===
        codeSequence.length
      ) {

        setFeedback(
          feedbackDiv,
          true,
          "✓ SYSTÈME DÉVERROUILLÉ"
        );

        const timeoutId =
          setTimeout(() => {

            gameManager.cleanup();

            onFinish();

          }, 800);

        gameManager.addTimeout(
          timeoutId
        );
      }

    }

    // =========================
    // ERROR
    // =========================
    else {

      setFeedback(
        feedbackDiv,
        false,
        "ERREUR DE SÉQUENCE"
      );

      currentBox.animate([
        {
          transform:
            "translateX(-10px)",
          borderColor: "red"
        },
        {
          transform:
            "translateX(10px)",
          borderColor: "red"
        },
        {
          transform:
            "translateX(0)",
          borderColor:
            "rgba(255,255,255,0.2)"
        }
      ], {
        duration: 100,
        iterations: 3
      });

      // RESET
      playerIndex = 0;

      const timeoutId =
        setTimeout(() => {

          boxes.forEach((box) => {

            box.style.background =
              "#000000";

            box.style.borderColor =
              "rgba(255,255,255,0.2)";

            box.style.boxShadow =
              "none";

            box.style.transform =
              "scale(1)";
          });

        }, 300);

      gameManager.addTimeout(
        timeoutId
      );
    }
  }

  // =========================
  // EVENT LISTENER
  // =========================
  gameManager.addEventListener(
    document,
    "keydown",
    handleKey
  );
}