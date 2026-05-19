import {
  createGameTitle,
  createFeedbackDiv,
  setFeedback
} from "../gameInterface.js";

import { gameManager } from "../gameCleanup.js";

export function startGame1(container, onFinish) {

  // RESET GAME
  gameManager.startGame();

  container.innerHTML = "";

  // =========================
  // CONTAINER
  // =========================
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.position = "relative";

  // =========================
  // TITLE HIDDEN
  // =========================
  const title = createGameTitle("");
  title.style.display = "none";

  const feedbackDiv = createFeedbackDiv();

  container.appendChild(title);
  container.appendChild(feedbackDiv);

  // =========================
  // GAME WRAPPER
  // =========================
  const gameWrapper =
    document.createElement("div");

  gameWrapper.style.position = "relative";

  gameWrapper.style.padding = "0";

  gameWrapper.style.borderRadius = "12px";

  gameWrapper.style.overflow = "hidden";

  gameWrapper.style.background = "transparent";

  // GLOW
  gameWrapper.style.border =
  "2px solid rgba(139,92,246,0.8)";

gameWrapper.style.boxShadow = `
  0 0 5px rgba(139,92,246,0.9),
  0 0 15px rgba(139,92,246,0.75),
  0 0 35px rgba(0,170,255,0.35),
  0 0 70px rgba(140,0,255,0.25)
`;

  // =========================
  // CANVAS
  // =========================
  const canvas =
    document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  // Responsive propre
  const tileSize = Math.min(
    window.innerWidth * 0.065,
    52
  );

  canvas.width = tileSize * 10;
  canvas.height = tileSize * 10;

  canvas.style.position = "relative";

  canvas.style.zIndex = "2";

  canvas.style.display = "block";

  canvas.style.background = "#050505";

  canvas.style.borderRadius = "8px";

  // CANVAS GLOW
  canvas.style.boxShadow = `
    0 0 30px rgba(0,170,255,0.16),
    0 0 60px rgba(140,0,255,0.12)
  `;

  gameWrapper.appendChild(canvas);

  container.appendChild(gameWrapper);

  // =========================
  // LEVEL
  // =========================
  const level = {

    map: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,0,1,1,1,0,1],
      [1,0,0,1,0,0,0,1,0,1],
      [1,0,0,0,0,1,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1]
    ],

    playerStart: {
      x: 1,
      y: 1
    },

    controls: {
      up: "s",
      down: "z",
      left: "e",
      right: "a"
    }
  };

  // =========================
  // PLAYER
  // =========================
  let player = {
    ...level.playerStart
  };

  let keys = {};

  // =========================
  // INPUTS
  // =========================
  const keyDownHandler = (e) => {
    keys[e.key.toLowerCase()] = true;
  };

  const keyUpHandler = (e) => {
    keys[e.key.toLowerCase()] = false;
  };

  gameManager.addEventListener(
    document,
    "keydown",
    keyDownHandler
  );

  gameManager.addEventListener(
    document,
    "keyup",
    keyUpHandler
  );

  // =========================
  // MOVE
  // =========================
  function move(dx, dy) {

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (level.map[newY][newX] !== 1) {

      player.x = newX;
      player.y = newY;

      // WIN
      if (level.map[newY][newX] === 2) {
        onWin();
      }
    }
  }

  // =========================
  // UPDATE
  // =========================
  function update() {

    const c = level.controls;

    if (keys[c.up]) {
      move(0, -1);
    }

    if (keys[c.down]) {
      move(0, 1);
    }

    if (keys[c.left]) {
      move(-1, 0);
    }

    if (keys[c.right]) {
      move(1, 0);
    }
  }

  // =========================
  // DRAW
  // =========================
  function draw() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    for (let y = 0; y < level.map.length; y++) {

      for (let x = 0; x < level.map[y].length; x++) {

        const tile =
          level.map[y][x];

        // WALLS
        if (tile === 1) {
          ctx.fillStyle = "#F1F1F1";
        }

        // GOAL
        else if (tile === 2) {
          ctx.fillStyle = "#008F4C";
        }

        // PATH
        else {
          ctx.fillStyle = "#050505";
        }

        ctx.fillRect(
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      }
    }

    // =========================
    // PLAYER
    // =========================
    ctx.shadowColor = "#B10F3A";

    ctx.shadowBlur = 18;

    ctx.fillStyle = "#C1123F";

    ctx.fillRect(
      player.x * tileSize + tileSize * 0.2,
      player.y * tileSize + tileSize * 0.2,
      tileSize * 0.6,
      tileSize * 0.6
    );

    ctx.shadowBlur = 0;
  }

  // =========================
  // FEEDBACK
  // =========================
  function showFeedback(
    isSuccess,
    message
  ) {

    setFeedback(
      feedbackDiv,
      isSuccess,
      message
    );
  }

  // =========================
  // WIN
  // =========================
  function onWin() {

    showFeedback(
      true,
      "✓ Bien joué !"
    );

    const timeoutId = setTimeout(() => {

      gameManager.cleanup();

      onFinish();

    }, 500);

    gameManager.addTimeout(timeoutId);
  }

  // =========================
  // LOOP
  // =========================
  function loop() {

    if (!gameManager.isRunning) {
      return;
    }

    update();

    draw();

    const frameId =
      requestAnimationFrame(loop);

    gameManager.addAnimationFrame(frameId);
  }

  loop();
}