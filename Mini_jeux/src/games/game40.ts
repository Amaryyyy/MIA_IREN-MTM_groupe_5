// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup"; 

let game40 = {};

export function startGame40(container, onFinish) {
  container.innerHTML = `
    <div style="text-align:center; font-family: 'Segoe UI', sans-serif; color: white; background: transparent; padding: 20px; border-radius: 15px;">
      <div style="font-size: 1.2em; margin-bottom: 10px;">🌀 Mouvements : <span id="moves17" style="color: #2ecc71;">0</span></div>
      <canvas id="cubeCanvas" width="360" height="360" style="border: 4px solid #34495e; border-radius: 8px; box-shadow: 0 0 12px rgba(79,157,255,0.12); cursor: pointer;"></canvas>
      <p id="msg17" style="margin-top: 15px; font-weight: bold; min-height: 24px;">Réorganise les lignes par couleur.</p>
    </div>
  `;

  const canvas = container.querySelector("#cubeCanvas");
  const ctx = canvas.getContext("2d");

  game40 = {
    ctx,
    canvas,
    size: 4,
    tileSize: 90,
    grid: [],
    moves: 0,
    onFinish,
    dragging: false,
    dragStart: null,
    anim: null,
    animDuration: 220
  };

  initCube();
  mixCube();
  renderCube();

  gameManager.addEventListener(canvas, "mousedown", startDrag);
  gameManager.addEventListener(canvas, "mouseup", endDrag);
}

/* ---------- INIT ---------- */

function initCube() {
  const colors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      game40.grid[row * 4 + col] = colors[row];
    }
  }
}

/* ---------- MIX ---------- */

function mixCube() {
  // Mélange réel : lignes + colonnes
  for (let i = 0; i < 20; i++) {
    if (Math.random() < 0.5) {
      const row = Math.floor(Math.random() * 4);
      slideRow(row, Math.random() < 0.5 ? 1 : -1, false);
    } else {
      const col = Math.floor(Math.random() * 4);
      slideCol(col, Math.random() < 0.5 ? 1 : -1, false);
    }
  }
}

/* ---------- DRAG ---------- */

function startDrag(e) {
  if (game40.anim) return; // ignore input during animation
  const rect = game40.canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const x = Math.floor(mx / game40.tileSize);
  const y = Math.floor(my / game40.tileSize);

  game40.dragging = true;
  game40.dragStart = { x, y, mx, my };
}

function endDrag(e) {
  if (!game40.dragging) return;
  game40.dragging = false;

  const rect = game40.canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const dx = mx - game40.dragStart.mx;
  const dy = my - game40.dragStart.my;

  const row = game40.dragStart.y;
  const col = game40.dragStart.x;

  // Horizontal → ligne
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20) slideRow(row, 1, true);
    else if (dx < -20) slideRow(row, -1, true);
  }
  // Vertical → colonne
  else {
    if (dy > 20) slideCol(col, 1, true);
    else if (dy < -20) slideCol(col, -1, true);
  }
}

/* ---------- SLIDE ROW ---------- */

function slideRow(row, dir, countMove) {
  if (!countMove) {
    const start = row * 4;
    const line = game40.grid.slice(start, start + 4);
    if (dir === 1) line.unshift(line.pop());
    else line.push(line.shift());
    for (let i = 0; i < 4; i++) game40.grid[start + i] = line[i];
    renderCube();
    return;
  }

  if (game40.anim) return;
  startRowAnimation(row, dir, () => {
    game40.moves++;
    document.getElementById("moves17").textContent = game40.moves;
    checkCubeWin();
  });
}

/* ---------- SLIDE COL ---------- */

function slideCol(col, dir, countMove) {
  if (!countMove) {
    const colVals = [];
    for (let i = 0; i < 4; i++) colVals.push(game40.grid[i * 4 + col]);
    if (dir === 1) colVals.unshift(colVals.pop());
    else colVals.push(colVals.shift());
    for (let i = 0; i < 4; i++) game40.grid[i * 4 + col] = colVals[i];
    renderCube();
    return;
  }

  if (game40.anim) return;
  startColAnimation(col, dir, () => {
    game40.moves++;
    document.getElementById("moves17").textContent = game40.moves;
    checkCubeWin();
  });
}

function startRowAnimation(row, dir, cb) {
  const start = performance.now();
  game40.anim = { type: 'row', index: row, dir, start, cb };

  function step(now) {
    const t = Math.min(1, (now - game40.anim.start) / game40.animDuration);
    game40.anim.progress = t;
    renderCube();
    if (t < 1) requestAnimationFrame(step);
    else {
      const base = row * 4;
      const line = game40.grid.slice(base, base + 4);
      if (dir === 1) line.unshift(line.pop());
      else line.push(line.shift());
      for (let i = 0; i < 4; i++) game40.grid[base + i] = line[i];
      const cbFn = game40.anim.cb;
      game40.anim = null;
      renderCube();
      if (cbFn) cbFn();
    }
  }
  requestAnimationFrame(step);
}

function startColAnimation(col, dir, cb) {
  const start = performance.now();
  game40.anim = { type: 'col', index: col, dir, start, cb };

  function step(now) {
    const t = Math.min(1, (now - game40.anim.start) / game40.animDuration);
    game40.anim.progress = t;
    renderCube();
    if (t < 1) requestAnimationFrame(step);
    else {
      const colVals = [];
      for (let i = 0; i < 4; i++) colVals.push(game40.grid[i * 4 + col]);
      if (dir === 1) colVals.unshift(colVals.pop());
      else colVals.push(colVals.shift());
      for (let i = 0; i < 4; i++) game40.grid[i * 4 + col] = colVals[i];
      const cbFn = game40.anim.cb;
      game40.anim = null;
      renderCube();
      if (cbFn) cbFn();
    }
  }
  requestAnimationFrame(step);
}

/* ---------- CHECK WIN ---------- */

function checkCubeWin() {
  for (let row = 0; row < 4; row++) {
    const start = row * 4;
    const color = game40.grid[start];

    for (let i = 0; i < 4; i++) {
      if (game40.grid[start + i] !== color) return;
    }
  }

  document.getElementById("msg17").textContent = "🎉 Bravo ! Toutes les lignes sont monochromes !";
  gameManager.addTimeout(setTimeout(game40.onFinish, 1500));
}

/* ---------- RENDER ---------- */

function renderCube() {
  const ctx = game40.ctx;
  // clear background (transparent)
  ctx.clearRect(0, 0, 360, 360);

  const ts = game40.tileSize;

  // light gray background matching the full game board (4x4 tiles)
  ctx.save();
  ctx.fillStyle = "rgba(200,200,200,0.12)";
  ctx.fillRect(5, 5, ts * 4 - 10, ts * 4 - 10);
  ctx.restore();

  if (game40.anim && game40.anim.type === 'row') {
    const row = game40.anim.index;
    const dir = game40.anim.dir;
    const prog = game40.anim.progress || 0;
    const offset = Math.round(dir * prog * ts);

    // draw all rows; animated row will be drawn with offset and an extra wrapped copy
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const color = game40.grid[idx];
        let x = c * ts;
        const y = r * ts;

        if (r === row) {
          // primary set
          ctx.fillStyle = color;
          ctx.fillRect(x + offset + 5, y + 5, ts - 10, ts - 10);
          // wrapped copy (opposite side)
          ctx.fillRect(x + offset - dir * 4 * ts + 5, y + 5, ts - 10, ts - 10);
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(x + 5, y + 5, ts - 10, ts - 10);
        }
      }
    }
    return;
  }

  if (game40.anim && game40.anim.type === 'col') {
    const col = game40.anim.index;
    const dir = game40.anim.dir;
    const prog = game40.anim.progress || 0;
    const offset = Math.round(dir * prog * ts);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const color = game40.grid[idx];
        const x = c * ts;
        let y = r * ts;

        if (c === col) {
          ctx.fillStyle = color;
          ctx.fillRect(x + 5, y + offset + 5, ts - 10, ts - 10);
          ctx.fillRect(x + 5, y + offset - dir * 4 * ts + 5, ts - 10, ts - 10);
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(x + 5, y + 5, ts - 10, ts - 10);
        }
      }
    }
    return;
  }

  // static draw
  for (let i = 0; i < 16; i++) {
    const color = game40.grid[i];
    const x = (i % 4) * game40.tileSize;
    const y = Math.floor(i / 4) * game40.tileSize;

    ctx.fillStyle = color;
    ctx.fillRect(x + 5, y + 5, ts - 10, ts - 10);
  }
}