// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";let game26 = {};

export function startGame26(container, onFinish) {

    const GAME_WIDTH = Math.min(
        window.innerWidth * 0.78,
        720
    );

    const GAME_HEIGHT = Math.min(
        window.innerHeight * 0.80,
        650
    );

    container.innerHTML = `
    <div style="
      text-align:center;
      padding:4px;
      display:flex;
      flex-direction:column;
      align-items:center;
    ">

    <p style="
      margin:0 0 4px;
      color:#d8d8ff;
      font-family:Orbitron,sans-serif;
      font-size:13px;
    ">
      Colorie le dessin avec le pinceau !
    </p>

    <canvas
      id="colorCanvas26"
      width="${GAME_WIDTH}"
      height="${GAME_HEIGHT}"
      style="
    width:100%;
    max-width:${GAME_WIDTH}px;
    height:auto;
    background:transparent;
    "
    </canvas>
     <p id="msg26" style="display:none;"></p> 

    </div>
    `;

    const canvas = container.querySelector("#colorCanvas26");
    canvas.style.filter =
  "drop-shadow(0 0 15px rgba(182, 139, 186, 0.5)) drop-shadow(0 0 35px rgba(62, 180, 198, 0.35))";
    const ctx = canvas.getContext("2d");

    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    const paintCanvas = document.createElement("canvas");
    const paintCtx = paintCanvas.getContext("2d");

    maskCanvas.width = paintCanvas.width = canvas.width;
    maskCanvas.height = paintCanvas.height = canvas.height;

    const palette = [
        { name: "rouge", color: "#e74c3c" },
        { name: "bleu", color: "#3498db" },
        { name: "vert", color: "#2ecc71" },
        { name: "jaune", color: "#f1c40f" },
        { name: "violet", color: "#9b59b6" },
        { name: "orange", color: "#e67e22" }
    ];

    const state = {
        ctx,
        canvas,
        maskCtx,
        paintCtx,
        palette,
        brushColor: palette[0].color,
        brushSize: 18,
        isPainting: false,
        lastX: null,
        lastY: null,
        usedColors: new Set(),
        statsDirty: true,
        insideCount: 0,
        outsideCount: 0,
        gameOver: false,
        onFinish,
        cursorX: null,
        cursorY: null
    };

    game26 = state;

    drawPaperAndOutline26();
    drawMaskOutline26(maskCtx);

    canvas.addEventListener("mousedown", onMouseDown26);
    canvas.addEventListener("mousemove", onMouseMove26);
    canvas.addEventListener("mouseup", onMouseUp26);
    canvas.addEventListener("mouseleave", onMouseUp26);

    canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        game26.cursorX = x;
        game26.cursorY = y;
    });

    renderLoop26();
}

/* ---------- INPUT ---------- */

function onMouseDown26(e) {
    if (game26.gameOver) return;

    const { x, y } = getCanvasPos26(e);
    if (tryPickColor26(x, y)) return;

    game26.isPainting = true;
    game26.lastX = x;
    game26.lastY = y;
    game26.usedColors.add(game26.brushColor);
}

function onMouseMove26(e) {
    if (!game26.isPainting || game26.gameOver) return;
    const { x, y } = getCanvasPos26(e);

    drawStroke26(game26.paintCtx, game26.lastX, game26.lastY, x, y, game26.brushColor, game26.brushSize);
    game26.lastX = x;
    game26.lastY = y;
    game26.statsDirty = true;
}

function onMouseUp26() {
    if (!game26.isPainting) return;
    game26.isPainting = false;
    checkWinCondition26();
}

/* ---------- LOGIQUE ---------- */

function getCanvasPos26(e) {
    const rect = game26.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function tryPickColor26(x, y) {

    const paletteY = game26.canvas.height - 45;
    const radius = 22;

    const spacing = 80;

    const totalWidth =
        spacing * (game26.palette.length - 1);

    const startX =
        (game26.canvas.width - totalWidth) / 2;

    for (let i = 0; i < game26.palette.length; i++) {

        const cx = startX + i * spacing;
        const cy = paletteY;

        if (Math.hypot(x - cx, y - cy) <= radius) {
            game26.brushColor = game26.palette[i].color;
            return true;
        }
    }

    return false;
}

function drawStroke26(ctx, x1, y1, x2, y2, color, size) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.restore();
}

function computeStats26() {
    const w = game26.canvas.width;
    const h = game26.canvas.height;

    const paintData = game26.paintCtx.getImageData(0, 0, w, h).data;
    const maskData = game26.maskCtx.getImageData(0, 0, w, h).data;

    let inside = 0;
    let outside = 0;

    for (let i = 0; i < paintData.length; i += 4) {
        const alpha = paintData[i + 3];
        if (alpha === 0) continue;

        const maskAlpha = maskData[i + 3];
        if (maskAlpha > 0) inside++;
        else outside++;
    }

    game26.insideCount = inside;
    game26.outsideCount = outside;
    game26.statsDirty = false;
}

function checkWinCondition26() {
    if (game26.statsDirty) computeStats26();

    const total = game26.insideCount + game26.outsideCount;
    if (total === 0) return;

    const ratioOutside = game26.outsideCount / total;
    const colorsUsed = game26.usedColors.size;

    if (ratioOutside > 0.5 && colorsUsed >= 3) {
        game26.gameOver = true;
        setMsg26("Tu as gagné… en dépassant partout et avec plein de couleurs. Le coloriage parfait, c'était le chaos.");
        setTimeout(() => game26.onFinish && game26.onFinish(), 1500);
    } else {
        if (colorsUsed < 3) {
            setMsg26("Tu ne dépasses pas assez ou tu n'as pas utilisé assez de couleurs. Ose plus, mélange au moins 3 couleurs.");
        } else {
            setMsg26("Dépasse davantage du dessin (au moins 70% de ta peinture doit être hors des lignes).");
        }
    }
}

/* ---------- RENDER LOOP ---------- */

function renderLoop26() {
    render26();
    requestAnimationFrame(renderLoop26);
}

function render26() {
    const ctx = game26.ctx;
    const canvas = game26.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaper26(ctx);
    drawOutline26(ctx);
    ctx.drawImage(game26.paintCtx.canvas, 0, 0);

    drawPalette26(ctx);
    drawBrushCursor26(ctx);
}

/* ---------- DESSIN : FEUILLE + DESSIN ---------- */

function drawPaperAndOutline26() {
    const ctx = game26.ctx;
    drawPaper26(ctx);
    drawOutline26(ctx);
}

function drawPaper26(ctx) {
    const x = 70;
    const y = 40;

    const w = game26.canvas.width - 140;
    const h = game26.canvas.height - 180;

    const r = 18;

    ctx.save();

    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#f5f5f5");

    ctx.fillStyle = grad;
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawOutline26(ctx) {
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const offsetX = 100;
    const offsetY = 80;

    // ====================
    // MAISON
    // ====================

    // Corps
    ctx.beginPath();
    ctx.rect(offsetX + 70, offsetY + 140, 220, 170);
    ctx.stroke();

    // Toit
    ctx.beginPath();
    ctx.moveTo(offsetX + 40, offsetY + 140);
    ctx.lineTo(offsetX + 180, offsetY + 35);
    ctx.lineTo(offsetX + 320, offsetY + 140);
    ctx.closePath();
    ctx.stroke();

    // Porte
    ctx.beginPath();
    ctx.rect(offsetX + 155, offsetY + 220, 50, 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(offsetX + 193, offsetY + 265, 3, 0, Math.PI * 2);
    ctx.stroke();

    // Fenêtre gauche
    ctx.beginPath();
    ctx.rect(offsetX + 95, offsetY + 180, 45, 45);
    ctx.moveTo(offsetX + 117, offsetY + 180);
    ctx.lineTo(offsetX + 117, offsetY + 225);
    ctx.moveTo(offsetX + 95, offsetY + 202);
    ctx.lineTo(offsetX + 140, offsetY + 202);
    ctx.stroke();

    // Fenêtre droite
    ctx.beginPath();
    ctx.rect(offsetX + 220, offsetY + 180, 45, 45);
    ctx.moveTo(offsetX + 242, offsetY + 180);
    ctx.lineTo(offsetX + 242, offsetY + 225);
    ctx.moveTo(offsetX + 220, offsetY + 202);
    ctx.lineTo(offsetX + 265, offsetY + 202);
    ctx.stroke();


    // ====================
    // SOLEIL
    // ====================

    const sx = offsetX + 430;
    const sy = offsetY + 45;

    ctx.beginPath();
    ctx.arc(sx, sy, 28, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;

        ctx.beginPath();
        ctx.moveTo(
            sx + Math.cos(a) * 35,
            sy + Math.sin(a) * 35
        );
        ctx.lineTo(
            sx + Math.cos(a) * 55,
            sy + Math.sin(a) * 55
        );
        ctx.stroke();
    }

    ctx.restore();
}

function drawMaskOutline26(maskCtx) {

    maskCtx.clearRect(
        0,
        0,
        maskCtx.canvas.width,
        maskCtx.canvas.height
    );

    maskCtx.save();
    maskCtx.fillStyle = "black";

    const offsetX = 100;
    const offsetY = 80;

    // Maison
    maskCtx.fillRect(
        offsetX + 70,
        offsetY + 140,
        220,
        170
    );

    maskCtx.beginPath();
    maskCtx.moveTo(offsetX + 40, offsetY + 140);
    maskCtx.lineTo(offsetX + 180, offsetY + 35);
    maskCtx.lineTo(offsetX + 320, offsetY + 140);
    maskCtx.closePath();
    maskCtx.fill();

    // Soleil
    const sx = offsetX + 430;
    const sy = offsetY + 45;

    maskCtx.beginPath();
    maskCtx.arc(sx, sy, 28, 0, Math.PI * 2);
    maskCtx.fill();

    maskCtx.restore();
}
/* ---------- PALETTE & PINCEAU ---------- */

function drawPalette26(ctx) {

    const paletteY = game26.canvas.height - 65;
    const radius = 18;

    const spacing = 80;

    const totalWidth =
        spacing * (game26.palette.length - 1);

    const startX =
        (game26.canvas.width - totalWidth) / 2;

    ctx.save();

    ctx.font = "16px Orbitron";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";

    ctx.fillText(
        " ",
        game26.canvas.width / 2,
        paletteY - 35
    );

    for (let i = 0; i < game26.palette.length; i++) {

        const color = game26.palette[i].color;

        const cx = startX + i * spacing;
        const cy = paletteY;

        ctx.save();

        ctx.shadowColor = "#00000055";
        ctx.shadowBlur = 8;

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (color === game26.brushColor) {

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.arc(
                cx,
                cy,
                radius + 4,
                0,
                Math.PI * 2
            );

            ctx.stroke();
        }
    }

    ctx.restore();
}

function drawBrushCursor26(ctx) {
    if (game26.cursorX == null || game26.cursorY == null) return;
    const x = game26.cursorX;
    const y = game26.cursorY;

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = game26.brushColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, game26.brushSize / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

/* ---------- UTILS ---------- */

function shuffle26(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function setMsg26(text) {
    const el = document.getElementById("msg26");
    if (el) el.textContent = text;
}
