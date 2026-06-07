// @ts-nocheck
import { getAdaptiveGridSettings } from "@/lib/responsiveUtils";
import { gameManager } from "@/lib/gameCleanup";

export function startGame13(container, onFinish) {

  if (!container) return;

  container.innerHTML = "";

  // =========================
  // CANVAS
  // =========================
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // GRAND CANVAS RESPONSIVE
  const GAME_WIDTH = Math.min(
    window.innerWidth * 0.95,
    1100
  );

  const GAME_HEIGHT = Math.min(
    window.innerHeight * 0.82,
    750
  );

  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  canvas.style.display = "block";
  canvas.style.margin = "auto";
  canvas.style.border = "2px solid #8B5CF6";
  canvas.style.borderRadius = "18px";

canvas.style.boxShadow = `
  0 0 10px rgba(139,92,246,0.6),
  0 0 25px rgba(168,85,247,0.45),
  0 0 50px rgba(34,211,238,0.25)
`;
  

  container.appendChild(canvas);

  // =========================
  // SCALE
  // =========================
  const SCALE_X = canvas.width / 900;
  const SCALE_Y = canvas.height / 600;

  function scaleRect(rect) {
    return {
      x: rect.x * SCALE_X,
      y: rect.y * SCALE_Y,
      w: rect.w ? rect.w * SCALE_X : undefined,
      h: rect.h ? rect.h * SCALE_Y : undefined,
      size: rect.size
        ? rect.size * SCALE_X
        : undefined,
      radius: rect.radius
        ? rect.radius * SCALE_X
        : undefined,
      min: rect.min,
      max: rect.max,
      open: rect.open,
      activated: rect.activated
    };
  }

  // =========================
  // PLAYER
  // =========================
  const player = {
    x: 60 * SCALE_X,
    y: 300 * SCALE_Y,
    size: 12 * SCALE_X,
    speed: 2.2 * SCALE_X,
  };

  let time = 0;
  let exitTimer = 0;

  // =========================
  // WALLS
  // =========================
  const walls = [
    { x: 0, y: 0, w: 900, h: 20 },
    { x: 0, y: 580, w: 900, h: 20 },
    { x: 0, y: 0, w: 20, h: 600 },
    { x: 880, y: 0, w: 20, h: 600 },

    { x: 200, y: 0, w: 20, h: 400 },
    { x: 200, y: 500, w: 20, h: 100 },

    { x: 450, y: 200, w: 20, h: 400 },
    { x: 450, y: 0, w: 20, h: 100 },

    { x: 300, y: 0, w: 20, h: 250 },
    { x: 300, y: 350, w: 20, h: 250 },

    { x: 450, y: 100, w: 20, h: 40 },
    { x: 450, y: 160, w: 20, h: 40 },
  ].map(scaleRect);

  // =========================
  // DOORS
  // =========================
  const doors = [
    { x: 200, y: 400, w: 20, h: 100, open: false },
    { x: 450, y: 140, w: 20, h: 20, open: false },
  ].map(scaleRect);

  // =========================
  // BUTTONS
  // =========================
  const buttons = [
    {
      x: 140,
      y: 300,
      size: 30,
      min: 22,
      max: 30,
      activated: false
    },

    {
      x: 380,
      y: 80,
      size: 30,
      min: 13,
      max: 17,
      activated: false
    },
  ].map(scaleRect);

  // =========================
  // ZONES
  // =========================
  const growZones = [
    {
      x: 80,
      y: 100,
      w: 100,
      h: 120
    }
  ].map(scaleRect);

  const shrinkZones = [
    {
      x: 60,
      y: 350,
      w: 100,
      h: 100
    },

    {
      x: 320,
      y: 250,
      w: 100,
      h: 100
    },
  ].map(scaleRect);

  // =========================
  // EXIT
  // =========================
  const exit = scaleRect({
    x: 820,
    y: 300,
    size: 20
  });

  // =========================
  // KEYS
  // =========================
  const keys = {};

  const down = (e) => {
    keys[e.key] = true;
  };

  const up = (e) => {
    keys[e.key] = false;
  };

  gameManager.addEventListener(
    document,
    "keydown",
    down
  );

  gameManager.addEventListener(
    document,
    "keyup",
    up
  );

  // =========================
  // COLLISION
  // =========================
  function collideRect(r) {

    const padding = 0.5;

    const rx = r.x - padding;
    const ry = r.y - padding;

    const rw =
      (r.w || r.size) + padding * 2;

    const rh =
      (r.h || r.size) + padding * 2;

    const closestX = Math.max(
      rx,
      Math.min(player.x, rx + rw)
    );

    const closestY = Math.max(
      ry,
      Math.min(player.y, ry + rh)
    );

    const dx = player.x - closestX;
    const dy = player.y - closestY;

    return (
      dx * dx + dy * dy <
      player.size * player.size
    );
  }

  function isColliding() {

    return (
      walls.some(collideRect) ||
      doors.some(
        (d) => !d.open && collideRect(d)
      )
    );
  }

  // =========================
  // MOVE
  // =========================
  function movePlayer() {

    let vx = 0;
    let vy = 0;

    if (keys["ArrowUp"]) {
      vy = -player.speed;
    }

    if (keys["ArrowDown"]) {
      vy = player.speed;
    }

    if (keys["ArrowLeft"]) {
      vx = -player.speed;
    }

    if (keys["ArrowRight"]) {
      vx = player.speed;
    }

    const steps = 4;

    const stepX = vx / steps;
    const stepY = vy / steps;

    for (let i = 0; i < steps; i++) {

      player.x += stepX;

      if (isColliding()) {
        player.x -= stepX;
      }

      player.y += stepY;

      if (isColliding()) {
        player.y -= stepY;
      }
    }
  }

  // =========================
  // SIZE
  // =========================
  function changeSize(amount, min, max) {

    const oldSize = player.size;

    player.size = Math.max(
      min * SCALE_X,
      Math.min(
        max * SCALE_X,
        player.size + amount * SCALE_X
      )
    );

    if (isColliding()) {
      player.size = oldSize;
    }
  }

  // =========================
  // DRAW HELPERS
  // =========================
  function rect(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
  }

  function roundRect(x, y, w, h, r) {

    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.lineTo(x + w - r, y);

    ctx.quadraticCurveTo(
      x + w,
      y,
      x + w,
      y + r
    );

    ctx.lineTo(x + w, y + h - r);

    ctx.quadraticCurveTo(
      x + w,
      y + h,
      x + w - r,
      y + h
    );

    ctx.lineTo(x + r, y + h);

    ctx.quadraticCurveTo(
      x,
      y + h,
      x,
      y + h - r
    );

    ctx.lineTo(x, y + r);

    ctx.quadraticCurveTo(
      x,
      y,
      x + r,
      y
    );

    ctx.fill();
  }

  // =========================
  // EXIT CHECK
  // =========================
  function isPlayerFullyInsideExit() {

    const dx = player.x - exit.x;
    const dy = player.y - exit.y;

    const distance = Math.hypot(dx, dy);

    return (
      distance + player.size <= exit.size
    );
  }

  // =========================
  // UPDATE
  // =========================
  function update() {

    movePlayer();

    time += 0.05;

    growZones.forEach((z) => {

      if (collideRect(z)) {
        changeSize(0.25, 5, 40);
      }
    });

    shrinkZones.forEach((z) => {

      if (collideRect(z)) {
        changeSize(-0.2, 5, 40);
      }
    });

    buttons.forEach((b, i) => {

      if (b.activated) return;

      if (
        collideRect(b) &&
        player.size >= b.min * SCALE_X &&
        player.size <= b.max * SCALE_X
      ) {

        b.activated = true;
        doors[i].open = true;
      }
    });

    if (isPlayerFullyInsideExit()) {

      exitTimer++;

      if (exitTimer > 20) {
        endGame();
      }

    } else {

      exitTimer = 0;
    }
  }

  // =========================
  // DRAW
  // =========================
  function draw() {

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );

      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(0.5, "#111827");
      gradient.addColorStop(1, "#1E1B4B");

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // WALLS
    ctx.fillStyle = "#2E1065";

    walls.forEach((w) => {
      rect(w.x, w.y, w.w, w.h);
    });

    // DOORS
    doors.forEach((d) => {

      if (!d.open) {

        ctx.fillStyle = "#7C3AED";
        ctx.shadowColor = "#8B5CF6";
        ctx.shadowBlur = 15;
        ctx.shadowBlur = 0;

        rect(d.x, d.y, d.w, d.h);
      }
    });
    // ZONES
    const pulse =
      Math.sin(time) * 0.1 + 0.3;

    // ZONE GRANDIR
    ctx.fillStyle =
      `rgba(217,70,239,${pulse})`;

    growZones.forEach((z) => {
      roundRect(
        z.x,
        z.y,
        z.w,
        z.h,
        10
      );
    });

    // ZONE RÉTRÉCIR
    ctx.fillStyle =
      `rgba(34,211,238,${pulse})`;

    shrinkZones.forEach((z) => {
      roundRect(
        z.x,
        z.y,
        z.w,
        z.h,
        10
      );
    });
    // BUTTONS
    buttons.forEach((b) => {

      if (b.activated) {
        ctx.fillStyle = "#22c55e";
      }

      else if (
        player.size > b.max * SCALE_X
      ) {
        ctx.fillStyle = "#ef4444";
      }

      else if (
        player.size < b.min * SCALE_X
      ) {
        ctx.fillStyle = "#3b82f6";
      }

      else {
        ctx.fillStyle = "#facc15";
      }

      roundRect(
        b.x,
        b.y,
        b.size,
        b.size,
        8
      );
    });

    // EXIT
    const active =
      isPlayerFullyInsideExit();

    ctx.fillStyle =
      active ? "#4ade80" : "#22c55e";

    ctx.beginPath();

    ctx.arc(
      exit.x,
      exit.y,
      exit.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // PLAYER
    ctx.fillStyle = "#60a5fa";

    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,
      player.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // =========================
  // LOOP
  // =========================
  function loop() {

    update();
    draw();

    requestAnimationFrame(loop);
  }

  // =========================
  // END
  // =========================

  function endGame() {
    gameManager.cleanup();
    onFinish?.();
  }
  // =========================
  // START
  // =========================
  loop();
}