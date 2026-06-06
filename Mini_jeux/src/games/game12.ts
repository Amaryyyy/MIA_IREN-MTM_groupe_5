// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";
import {
  getAdaptiveGridSettings,
  setResponsiveCanvas
} from "@/lib/responsiveUtils";

export function startGame12(container, onFinish) {

  if (!container) return;

  container.innerHTML = "";

// =========================
// CANVAS
// =========================
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Responsive sizing
const GAME_SIZE = Math.min(
  window.innerWidth * 0.90,
  window.innerHeight * 0.80
);

canvas.width = GAME_SIZE;
canvas.height = GAME_SIZE;

canvas.style.display = "block";
canvas.style.margin = "auto";

canvas.style.border = "none";

canvas.style.borderRadius = "18px";

// ===== NÉON CYBER =====

canvas.style.background =
  "linear-gradient(180deg, #07111f 0%, #050816 100%)";

canvas.style.border =
  "2px solid rgba(80,220,255,0.95)";

canvas.style.boxShadow = `
  0 0 6px rgba(0,255,255,0.9),
  0 0 16px rgba(0,220,255,0.7),
  0 0 35px rgba(0,140,255,0.45),
  0 0 70px rgba(111,0,255,0.22)
`;

canvas.style.outline =
  "1px solid rgba(180,255,255,0.20)";

canvas.style.outlineOffset = "-6px";


container.appendChild(canvas);

const WORLD_WIDTH = canvas.width;
const WORLD_HEIGHT = canvas.height;
  // =========================
  // PLAYER
  // =========================
  const player = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    size: 8,
    speed: 2
  };

  let foods = [];
  let shrinkZones = [];

  const foodColors = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171"
  ];

  const zoneColor =
    "rgba(59, 130, 246, 0.15)";

  let smallTime = 0;
  const requiredSmallTime = 20;

  const keys = {};

  // =========================
  // KEYBOARD
  // =========================
  function handleKeyDown(e) {
    keys[e.key] = true;
  }

  function handleKeyUp(e) {
    keys[e.key] = false;
  }

  gameManager.addEventListener(
    document,
    "keydown",
    handleKeyDown
  );

  gameManager.addEventListener(
    document,
    "keyup",
    handleKeyUp
  );

  function preventScroll(e) {

    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  }

  gameManager.addEventListener(
    window,
    "keydown",
    preventScroll
  );

  // =========================
  // SPAWN FOOD
  // =========================
  function spawnFood() {

    foods.push({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      size: 6,
      color:
        foodColors[
          Math.floor(
            Math.random() * foodColors.length
          )
        ]
    });
  }

  // =========================
  // SPAWN ZONE
  // =========================
  function spawnZone() {

    shrinkZones.push({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      radius: 50
    });
  }

  gameManager.addInterval(
    setInterval(spawnFood, 900)
  );

  gameManager.addInterval(
    setInterval(spawnZone, 2500)
  );

  // =========================
  // UPDATE
  // =========================
  function update() {

    if (keys["ArrowUp"]) {
      player.y -= player.speed;
    }

    if (keys["ArrowDown"]) {
      player.y += player.speed;
    }

    if (keys["ArrowLeft"]) {
      player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
      player.x += player.speed;
    }

    // LIMITES
    player.x = Math.max(
      player.size,
      Math.min(
        WORLD_WIDTH - player.size,
        player.x
      )
    );

    player.y = Math.max(
      player.size,
      Math.min(
        WORLD_HEIGHT - player.size,
        player.y
      )
    );

    // COLLISION FOOD
    foods = foods.filter((f) => {

      const dx = player.x - f.x;
      const dy = player.y - f.y;

      const dist = Math.sqrt(
        dx * dx + dy * dy
      );

      if (dist < player.size + f.size) {
        player.size += 1.5;
        return false;
      }

      return true;
    });

    // SHRINK ZONES
    shrinkZones.forEach((z) => {

      const dx = player.x - z.x;
      const dy = player.y - z.y;

      const dist = Math.sqrt(
        dx * dx + dy * dy
      );

      if (dist < z.radius) {
        player.size -= 0.15;
      }
    });

    player.size = Math.max(4, player.size);

    // LOSE
    if (player.size > 40) {
      endGame("💀 Trop gros !");
    }

    // WIN CONDITION
    if (player.size <= 10) {
      smallTime += 1 / 60;
    } else {
      smallTime = 0;
    }

    if (smallTime >= requiredSmallTime) {
      endGame(
        "🎉 Tu es resté petit 20s !"
      );
    }
  }

  // =========================
  // DRAW
  // =========================
  function draw() {

    ctx.clearRect(
      0,
      0,
      WORLD_WIDTH,
      WORLD_HEIGHT
    );

    // Background
    ctx.fillStyle = "#0f172a";

    ctx.fillRect(
      0,
      0,
      WORLD_WIDTH,
      WORLD_HEIGHT
    );

    // FOODS
    foods.forEach((f) => {

      ctx.beginPath();

      ctx.arc(
        f.x,
        f.y,
        f.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = f.color;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 10;

      ctx.fill();

      ctx.shadowBlur = 0;
    });

    // ZONES
    shrinkZones.forEach((z) => {

      ctx.beginPath();

      ctx.arc(
        z.x,
        z.y,
        z.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = zoneColor;

      ctx.fill();
    });

    // PLAYER
    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,
      player.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      player.size <= 10
        ? "#22c55e"
        : "#ffffff";

    ctx.shadowColor =
      player.size <= 10
        ? "#22c55e"
        : "#ffffff";

    ctx.shadowBlur = 15;

    ctx.fill();

    ctx.shadowBlur = 0;

    // UI
    ctx.font = "16px Arial";
    ctx.fillStyle = "#e5e7eb";

    ctx.fillText(
      `Taille: ${player.size.toFixed(1)}`,
      10,
      25
    );

    ctx.fillText(
      `Temps petit: ${smallTime.toFixed(1)} / 20`,
      10,
      50
    );
  }

  // =========================
  // GAME LOOP
  // =========================
  function gameLoop() {

    update();
    draw();

    const frameId =
      requestAnimationFrame(gameLoop);

    gameManager.addAnimationFrame(frameId);
  }

  // =========================
  // END GAME
  // =========================
  function endGame(message) {

    gameManager.addTimeout(
      setTimeout(() => {

        if (gameManager.isRunning) {

          gameManager.cleanup();

          alert(message);

          onFinish();
        }

      }, 100)
    );
  }

  // =========================
  // START
  // =========================
  gameLoop();
}