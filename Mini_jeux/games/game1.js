import { createGameTitle, createFeedbackDiv, setFeedback } from "../gameInterface.js";
import { getAdaptiveGridSettings, setResponsiveText } from "../responsiveUtils.js";
import { gameManager } from "../gameCleanup.js";

export function startGame1(container, onFinish) {
  container.innerHTML = "";
  
  const title = createGameTitle("Labyrinthe");
  setResponsiveText(title, 16, 24);
  title.style.margin = "8px 0";
  
  const feedbackDiv = createFeedbackDiv();
  feedbackDiv.style.fontSize = "14px";
  feedbackDiv.style.margin = "8px 0";
  
  container.appendChild(title);
  container.appendChild(feedbackDiv);
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Responsive sizing - adapte tout automatiquement
  const gridSettings = getAdaptiveGridSettings(20);
  const tileSize = gridSettings.gridSize;
  const cols = gridSettings.cols;
  const rows = gridSettings.rows;
  
  canvas.width = gridSettings.canvasWidth;
  canvas.height = gridSettings.canvasHeight;
  canvas.style.border = "2px solid #4CAF50";
  canvas.style.borderRadius = "8px";
  canvas.style.display = "block";
  canvas.style.margin = "8px auto";
  
  container.appendChild(canvas);

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
    playerStart: { x: 1, y: 1 },
    controls: { up: "s", down: "z", left: "e", right: "a" }
  };
  
  let player = { ...level.playerStart };
  let keys = {};

  function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
  }

  function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  gameManager.addEventListener(document, "keydown", handleKeyDown);
  gameManager.addEventListener(document, "keyup", handleKeyUp);

  function move(dx, dy) {
    let newX = player.x + dx;
    let newY = player.y + dy;
    if (level.map[newY] && level.map[newY][newX] !== 1) {
      player.x = newX;
      player.y = newY;
      if (level.map[newY][newX] === 2) {
        onWin();
      }
    }
  }

  function update() {
    const c = level.controls;
    if (keys[c.up]) move(0, -1);
    if (keys[c.down]) move(0, 1);
    if (keys[c.left]) move(-1, 0);
    if (keys[c.right]) move(1, 0);
  }

  function draw() {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < level.map.length; y++) {
      for (let x = 0; x < level.map[y].length; x++) {
        const cell = level.map[y][x];
        const px = x * tileSize;
        const py = y * tileSize;

        if (cell === 1) {
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = "#388E3C";
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, tileSize, tileSize);
        } else if (cell === 2) {
          ctx.fillStyle = "#FFD700";
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.fillStyle = "#FFA500";
          ctx.beginPath();
          ctx.arc(px + tileSize / 2, py + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const px = player.x * tileSize;
    const py = player.y * tileSize;
    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.arc(px + tileSize / 2, py + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#C92A2A";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function onWin() {
    setFeedback(feedbackDiv, true, "✓ Bravo! Tu as gagné!");
    gameManager.cleanup();
    setTimeout(onFinish, 1000);
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  draw();
  gameManager.addAnimationFrame(requestAnimationFrame(gameLoop));
}
