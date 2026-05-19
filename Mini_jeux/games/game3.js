import {
  getAdaptiveGridSettings,
  setResponsiveCanvas
} from "../responsiveUtils.js";

import { gameManager } from "../gameCleanup.js";

export function startGame3(container, onFinish) {

  // =========================
  // START GAME
  // =========================
  gameManager.startGame();

  // =========================
  // RESET
  // =========================
  container.innerHTML = "";

  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.overflow = "hidden";

  // =========================
  // RESPONSIVE
  // =========================
  const isMobile =
    window.innerWidth < 768;

  // =========================
  // CANVAS WRAPPER
  // =========================
  const canvasWrapper =
    document.createElement("div");

  canvasWrapper.style.background =
    "transparent";

  canvasWrapper.style.padding =
    "0px";

  canvasWrapper.style.borderRadius =
    "22px";

  canvasWrapper.style.display =
    "flex";

  canvasWrapper.style.justifyContent =
    "center";

  canvasWrapper.style.alignItems =
    "center";

  canvasWrapper.style.overflow =
    "hidden";

  canvasWrapper.style.border =
    "2px solid rgba(139,92,246,0.9)";
  
  canvasWrapper.style.boxShadow = `
    0 0 5px rgba(139,92,246,0.95),
    0 0 18px rgba(139,92,246,0.75),
    0 0 40px rgba(0,170,255,0.35),
    0 0 80px rgba(140,0,255,0.28),
    0 0 140px rgba(0,170,255,0.14)
  `;
  container.appendChild(
    canvasWrapper
  );

  // =========================
  // CANVAS
  // =========================
  const canvas =
    document.createElement("canvas");

  const ctx =
    canvas.getContext("2d");

  // =========================
  // RESPONSIVE UTILS
  // =========================
  getAdaptiveGridSettings(
    isMobile ? 26 : 42
  );

  // =========================
  // IMMENSE ZONE DE JEU
  // =========================
  const canvasWidth = isMobile
    ? window.innerWidth * 0.96
    : window.innerWidth * 0.82;

  const canvasHeight = isMobile
    ? window.innerHeight * 0.72
    : window.innerHeight * 0.84;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  setResponsiveCanvas(
    canvas,
    canvasWidth,
    canvasHeight
  );

  // =========================
  // STYLE
  // =========================
  canvas.style.border = "none";

  canvas.style.borderRadius =
    "18px";

  canvas.style.background =
    "#050505";

  canvas.style.display =
    "block";

  canvas.style.width =
    "100%";

  canvas.style.height =
    "100%";

  canvas.style.maxWidth =
    "96vw";

  canvas.style.maxHeight =
    "90vh";

  canvas.style.boxShadow = `
    0 0 40px rgba(0,170,255,0.18),
    0 0 80px rgba(140,0,255,0.14)
  `;

  canvasWrapper.appendChild(canvas);

  // =========================
  // CONFIG
  // =========================
  const innerPadding =
    canvas.width * 0.03;

  const playableWidth =
    canvas.width - innerPadding ;

  const playableHeight =
    canvas.height - innerPadding *2;

  const tileSize =
    Math.min(
      playableWidth / 10,
      playableHeight / 10
    );

  // =========================
  // LEVEL
  // =========================
  const level = {

    map: [
      [0,0,1,0,0,0,1,0,0,0],
      [1,0,1,0,1,0,1,0,1,0],
      [1,0,0,0,1,0,0,0,0,0],
      [1,1,1,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,0,0,0,1,0,1],
      [1,0,0,0,0,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,0,2]
    ],

    playerStart: {
      x: 0,
      y: 0
    }
  };

  // =========================
  // RANDOM KEYS
  // =========================
  const allKeys = [
    "a","b","c","d","e","f","g","h",
    "i","j","k","l","m","n","o","p",
    "q","r","s","t","u","v","w","x",
    "y","z"
  ];

  function shuffle(array) {

    const arr = [...array];

    for (
      let i = arr.length - 1;
      i > 0;
      i--
    ) {

      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [arr[i], arr[j]] =
      [arr[j], arr[i]];
    }

    return arr;
  }

  const shuffled =
    shuffle(allKeys);

  const controls = {
    up: shuffled[0],
    down: shuffled[1],
    left: shuffled[2],
    right: shuffled[3]
  };

  // =========================
  // PLAYER
  // =========================
  let player = {
    x: level.playerStart.x,
    y: level.playerStart.y
  };

  let trail = [];

  const keys = {};

  // =========================
  // KEYBOARD
  // =========================
  const keyDownHandler = (e) => {
    keys[e.key.toLowerCase()] = true;
  };

  const keyUpHandler = (e) => {
    keys[e.key.toLowerCase()] = false;
  };

  gameManager.addEventListener(
    window,
    "keydown",
    keyDownHandler
  );

  gameManager.addEventListener(
    window,
    "keyup",
    keyUpHandler
  );

  // =========================
  // MOVE
  // =========================
  function move(dx, dy) {

    const newX =
      player.x + dx;

    const newY =
      player.y + dy;

    if (
      level.map[newY]?.[newX] !== 1 &&
      level.map[newY]?.[newX] !== undefined
    ) {

      trail.push({
        x: player.x,
        y: player.y
      });

      if (trail.length > 15) {
        trail.shift();
      }

      player.x = newX;
      player.y = newY;

      // WIN
      if (
        level.map[newY][newX] === 2
      ) {

        const timeoutId =
          setTimeout(() => {

            gameManager.cleanup();

            onFinish();

          }, 300);

        gameManager.addTimeout(
          timeoutId
        );
      }
    }
  }

  // =========================
  // UPDATE
  // =========================
  function update() {

    if (keys[controls.up]) {
      move(0, -1);
    }

    if (keys[controls.down]) {
      move(0, 1);
    }

    if (keys[controls.left]) {
      move(-1, 0);
    }

    if (keys[controls.right]) {
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

    // BACKGROUND
    ctx.fillStyle = "#050505";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // START TILE
    ctx.fillStyle = "#008F4C";

    ctx.fillRect(
      Math.round(
        innerPadding +
        level.playerStart.x * tileSize+40
      ),

      Math.round(
        innerPadding +
        level.playerStart.y * tileSize
      ),

      tileSize,
      tileSize
    );

    // GOAL
    for (
      let y = 0;
      y < level.map.length;
      y++
    ) {

      for (
        let x = 0;
        x < level.map[y].length;
        x++
      ) {

        if (
          level.map[y][x] === 2
        ) {

          ctx.fillStyle =
            "#C1123F";

          ctx.fillRect(
            Math.round(
              innerPadding +
              x * tileSize
            ),

            Math.round(
              innerPadding +
              y * tileSize
            ),

            tileSize,
            tileSize
          );
        }
      }
    }

    // TRAIL
    trail.forEach((pos, i) => {

      ctx.fillStyle = `
        rgba(
          131,
          111,
          255,
          ${i / trail.length}
        )
      `;

      ctx.fillRect(
        Math.round(
          innerPadding +
          pos.x * tileSize +
          tileSize * 0.25
        ),

        Math.round(
          innerPadding +
          pos.y * tileSize +
          tileSize * 0.25
        ),

        tileSize * 0.5,
        tileSize * 0.5
      );
    });

    // PLAYER
    ctx.shadowColor = "#8b5cf6";

    ctx.shadowBlur = 25;

    ctx.fillStyle = "#a28bff";

    ctx.beginPath();

    ctx.arc(
      Math.round(
        innerPadding +
        player.x * tileSize +40+
        tileSize / 2
      ),

      Math.round(
        innerPadding +
        player.y * tileSize +
        tileSize / 2
      ),

      tileSize / 3,

      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
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

    gameManager.addAnimationFrame(
      frameId
    );
  }

  loop();
}