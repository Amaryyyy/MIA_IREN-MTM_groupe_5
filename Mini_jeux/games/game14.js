import { gameManager } from "../gameCleanup.js";
import { setResponsiveCanvas, getAdaptiveGridSettings } from "../responsiveUtils.js";

export function startGame14(container, onFinish) {
  container.innerHTML = "";
  

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // ===== UTILISER LES FONCTIONS ROBUSTES =====
  const gridSettings = getAdaptiveGridSettings(24);

  canvas.width = Math.min(
    gridSettings.canvasWidth + 120,
    window.innerWidth * 0.96
  );
  
  canvas.height = Math.min(
    gridSettings.canvasHeight + 80,
    window.innerHeight * 0.82
  );

  
 // ===== STYLE NÉON PREMIUM =====

canvas.style.background = "#050816";

canvas.style.border = "2px solid rgba(23, 110, 79, 0.95)";

canvas.style.borderRadius = "28px";

canvas.style.boxShadow = `
0 0 6px rgba(80, 255, 86, 0.9),
0 0 12px rgba(80, 255, 100, 0.65),
0 0 22px rgba(0, 255, 85, 0.69)
`;

canvas.style.position = "relative";


canvas.style.zIndex = "2";
  container.appendChild(canvas);

  const grid = gridSettings.gridSize;
// recalcul selon la vraie taille du canvas
const cols = Math.floor(canvas.width / grid);
const rows = Math.floor(canvas.height / grid);

  let snake = [];
  let direction = { x: 1, y: 0 };
  let food = null;
  let running = true;

  const initialLength = 8;
  const minLength = 3;

  function reset() {
    snake = [];

    for (let i = 0; i < initialLength; i++) {
      snake.push({ x: 5 - i, y: 5 });
    }

    direction = { x: 1, y: 0 };

    placeFood();

    running = true;
  }

  function placeFood() {

    let valid = false;

    while (!valid) {

      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);

      valid = !snake.some(
        (seg) => seg.x === x && seg.y === y
      );

      if (valid) {

        const color =
          Math.random() < 0.5
            ? "red"
            : "green";

        food = { x, y, color };
      }
    }
  }

  function drawSegment(seg, index) {

    const x = seg.x * grid;
    const y = seg.y * grid;

    const baseHue = 130;
    const hue =
      baseHue + (index % 6) * 5;

    const saturation = 70;

    const lightness =
      index === 0
        ? 35
        : 55 - (index % 4) * 5;

    const gradient =
      ctx.createLinearGradient(
        x,
        y,
        x + grid,
        y + grid
      );

    gradient.addColorStop(
      0,
      `hsl(${hue}, ${saturation}%, ${lightness}%)`
    );

    gradient.addColorStop(
      1,
      `hsl(${hue + 10}, ${saturation}%, ${Math.max(20, lightness - 15)}%)`
    );

    ctx.save();

    if (index === 0) {

      ctx.shadowColor =
        "rgba(255, 220, 120, 0.85)";

      ctx.shadowBlur = 12;

    } else {

      ctx.shadowColor =
        "rgba(120, 255, 120, 0.45)";

      ctx.shadowBlur = 8;
    }

    ctx.fillStyle = gradient;

    ctx.strokeStyle =
      "rgba(40, 80, 40, 0.85)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.roundRect(
      x + 1,
      y + 1,
      grid - 2,
      grid - 2,
      6
    );

    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Tête
    if (index === 0) {

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();

      ctx.arc(
        x + grid * 0.35,
        y + grid * 0.35,
        2.3,
        0,
        Math.PI * 2
      );

      ctx.arc(
        x + grid * 0.65,
        y + grid * 0.35,
        2.3,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = "#000000";

      ctx.beginPath();

      ctx.arc(
        x + grid * 0.35,
        y + grid * 0.35,
        1.1,
        0,
        Math.PI * 2
      );

      ctx.arc(
        x + grid * 0.65,
        y + grid * 0.35,
        1.1,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  function drawFood() {

    const x = food.x * grid;
    const y = food.y * grid;

    const gradient =
      ctx.createRadialGradient(
        x + grid / 2,
        y + grid / 2,
        2,
        x + grid / 2,
        y + grid / 2,
        grid / 2
      );

    if (food.color === "green") {

      gradient.addColorStop(0, "#b9f2b9");
      gradient.addColorStop(1, "#2ca02c");

    } else {

      gradient.addColorStop(0, "#ffb3b3");
      gradient.addColorStop(1, "#d62828");
    }

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
      x + grid / 2,
      y + grid / 2,
      grid / 3,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  function draw() {

    const bg =
      ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        50,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

    bg.addColorStop(0, "#102a1c");
    bg.addColorStop(0.4, "#1f4a2f");
    bg.addColorStop(1, "#062016");

    ctx.fillStyle = bg;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Grille
    ctx.strokeStyle =
      "rgba(181,255,191,0.18)";

    ctx.lineWidth = 1;

    for (let i = 0; i <= cols; i++) {

      ctx.beginPath();

      ctx.moveTo(i * grid, 0);
      ctx.lineTo(i * grid, canvas.height);

      ctx.stroke();
    }

    for (let i = 0; i <= rows; i++) {

      ctx.beginPath();

      ctx.moveTo(0, i * grid);
      ctx.lineTo(canvas.width, i * grid);

      ctx.stroke();
    }

    drawFood();

    snake.forEach((segment, index) => {
      drawSegment(segment, index);
    });
  }

  // STATUS MASQUÉ
  function setStatus(text) {
    // caché
  }

  const tickInterval = 120;

  let lastTick = 0;

  function step() {

    if (!running) return;

    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    // Mur
    if (
      head.x < 0 ||
      head.x >= cols ||
      head.y < 0 ||
      head.y >= rows
    ) {

      const newX =
        (head.x + cols) % cols;

      const newY =
        (head.y + rows) % rows;

      snake.unshift({
        x: newX,
        y: newY
      });

      for (let i = 0; i < 2; i++) {
        snake.push({
          ...snake[snake.length - 1]
        });
      }

      if (snake.length > 40) {

        running = false;

        setTimeout(() => {
          reset();
          requestAnimationFrame(loop);
        }, 1000);

        return;
      }

    } else {

      snake.unshift(head);
    }

    // Auto morsure
    const collidedIndex =
      snake
        .slice(1)
        .findIndex(
          (seg) =>
            seg.x === head.x &&
            seg.y === head.y
        );

    if (collidedIndex >= 0) {

      const shrinkAmount = 2;

      let removed = 0;

      while (
        removed < shrinkAmount &&
        snake.length > minLength
      ) {
        snake.pop();
        removed++;
      }

      if (snake.length <= minLength) {

        running = false;

        setTimeout(onFinish, 800);

        return;
      }
    }

    // Food
    const ate =
      head.x === food.x &&
      head.y === food.y;

    if (ate) {

      placeFood();

    } else {

      snake.pop();
    }

    if (snake.length <= minLength) {

      running = false;

      setTimeout(onFinish, 800);

      return;
    }

    if (snake.length > 40) {

      running = false;

      setTimeout(() => {
        reset();
        requestAnimationFrame(loop);
      }, 1000);

      return;
    }

    draw();
  }

  function loop(timestamp) {

    if (!running) return;

    if (
      timestamp - lastTick >
      tickInterval
    ) {

      lastTick = timestamp;

      step();
    }

    requestAnimationFrame(loop);
  }

  function handleKey(e) {

    const key = e.key.toLowerCase();

    if (
      key === "arrowup" ||
      key === "z"
    ) {
      if (direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
    }

    if (
      key === "arrowdown" ||
      key === "s"
    ) {
      if (direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
    }

    if (
      key === "arrowleft" ||
      key === "q"
    ) {
      if (direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
    }

    if (
      key === "arrowright" ||
      key === "d"
    ) {
      if (direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
    }
  }

  gameManager.addEventListener(
    window,
    "keydown",
    handleKey
  );

  reset();

  requestAnimationFrame(loop);
}