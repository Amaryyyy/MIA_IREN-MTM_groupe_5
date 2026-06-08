// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

let game23 = {};

export function startGame25(container, onFinish) {
    container.innerHTML = `
        <div style="text-align:center; font-family:'VT323', monospace; color:white; background:transparent; padding:20px; border-radius:15px; max-width:960px; margin:0 auto; overflow:hidden; display:flex; flex-direction:column; align-items:center; gap:10px;">
            
            <p style="margin:0 0 8px; font-size:0.95em;">

            <canvas id="shapeCanvas23" width="900" height="500"
                style="border-radius:8px; background:transparent; display:block; max-width:100%; height:auto;">
            </canvas>

            <p id="msg23" style="margin-top:8px; min-height:24px; font-size:1.05em;">
            </p>
        </div>
    `;

    const canvas = container.querySelector("#shapeCanvas23");
    const ctx = canvas.getContext("2d");
    const baseWidth = canvas.width;
    const baseHeight = canvas.height;

    function resizeCanvas23() {
        const availableWidth = Math.max(320, Math.min(window.innerWidth - 32, 920));
        const availableHeight = Math.max(360, window.innerHeight - 250);
        const scale = Math.min(
            availableWidth / baseWidth,
            availableHeight / baseHeight,
            1
        );

        canvas.style.width = `${Math.floor(baseWidth * scale)}px`;
        canvas.style.height = `${Math.floor(baseHeight * scale)}px`;
    }

    /* ---------- COULEURS NÉON ---------- */
    const COLORS = {
        cyan: "#00eaff",
        magenta: "#ff00ff",
        lime: "#aaff00",
        violet: "#b966ff",
        orange: "#ff9f1c",
        pink: "#ff4fa3",
        blue: "#4f9dff"
    };

    /* ---------- PLATEAU CARRÉ ---------- */
    const board = {
        x: 225,
        y: 40,
        size: 450
    };

    /* ---------- SLOTS (TROUS) ---------- */
    const slots = [
        { id: "S1", x: 305, y: 160, shape: "hex",     colorKey: "cyan",    filledBy: null },
        { id: "S2", x: 450, y: 160, shape: "circle",  colorKey: "magenta", filledBy: null },
        { id: "S3", x: 595, y: 160, shape: "triangle",colorKey: "lime",    filledBy: null },
        { id: "S4", x: 305, y: 320, shape: "cross",   colorKey: "violet",  filledBy: null },
        { id: "S5", x: 450, y: 320, shape: "drop",    colorKey: "orange",  filledBy: null },
        { id: "S6", x: 595, y: 320, shape: "diamond", colorKey: "pink",    filledBy: null }
    ];

    /* ---------- PIÈCES (FORMES 3D NÉON) ---------- */
    const pieceSize = 90;
const shapes = ["circle","triangle","hex","drop","cross","diamond"];
const colorKeys = ["cyan","magenta","lime","violet","orange","pink"];

const pieces = [];

// 3 à gauche
const leftX = board.x - 150;

// 3 à droite
const rightX = board.x + board.size + 60;

const startY = board.y + 40;
const gapY = 110;


for (let c = 0; c < 3; c++) {

    const y = board.y + 40 + c * 110;

    // Gauche
    pieces.push({
        id: `P${c + 1}`,
        shape: shapes[c],
        colorKey: colorKeys[c],
        x: leftX,
        y,
        w: pieceSize,
        h: pieceSize,
        homeX: leftX,
        homeY: y,
        slotId: null
    });

    // Droite
    pieces.push({
        id: `P${c + 4}`,
        shape: shapes[c + 3],
        colorKey: colorKeys[c + 3],
        x: rightX,
        y,
        w: pieceSize,
        h: pieceSize,
        homeX: rightX,
        homeY: y,
        slotId: null
    });
}

    game23 = {
        ctx,
        canvas,
        onFinish,
        board,
        slots,
        pieces,
        colors: COLORS,
        draggingIndex: null,
        dragOffsetX: 0,
        dragOffsetY: 0,
        gameOver: false
    };

    canvas.addEventListener("mousedown", onMouseDown23);
    canvas.addEventListener("mousemove", onMouseMove23);
    canvas.addEventListener("mouseup", onMouseUp23);
    canvas.addEventListener("mouseleave", onMouseUp23);
    window.addEventListener("resize", resizeCanvas23);

    resizeCanvas23();

    render23();
}

/* ---------- INPUT ---------- */

function onMouseDown23(e) {
    if (game23.gameOver) return;

    const rect = game23.canvas.getBoundingClientRect();
    const scaleX = game23.canvas.width / rect.width;
    const scaleY = game23.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    for (let i = game23.pieces.length - 1; i >= 0; i--) {
        const p = game23.pieces[i];
        if (pointInPiece23(x, y, p)) {
            game23.draggingIndex = i;
            game23.dragOffsetX = x - p.x;
            game23.dragOffsetY = y - p.y;
            game23.pieces.push(game23.pieces.splice(i, 1)[0]);
            render23();
            return;
        }
    }
}

function onMouseMove23(e) {
    if (game23.draggingIndex == null) return;

    const rect = game23.canvas.getBoundingClientRect();
    const scaleX = game23.canvas.width / rect.width;
    const scaleY = game23.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const p = game23.pieces[game23.pieces.length - 1];
    p.x = x - game23.dragOffsetX;
    p.y = y - game23.dragOffsetY;

    render23();
}

function onMouseUp23() {
    if (game23.draggingIndex == null) return;

    const p = game23.pieces[game23.pieces.length - 1];
    const slot = nearestSlot23(p);

    if (slot && !slot.filledBy) {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;

        const dist = Math.hypot(cx - slot.x, cy - slot.y);

        if (dist < 35 && slot.colorKey === p.colorKey) {
            p.x = slot.x - p.w / 2;
            p.y = slot.y - p.h / 2;
            p.slotId = slot.id;
            slot.filledBy = p.id;
            if (checkWin23()) endGame23();
        } else {
            resetPiecePosition23(p);
        }
    } else {
        resetPiecePosition23(p);
    }

    game23.draggingIndex = null;
    render23();
}

/* ---------- LOGIQUE ---------- */

function pointInPiece23(x, y, p) {
    return x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h;
}

function nearestSlot23(piece) {
    let best = null;
    let bestDist = 999999;
    const cx = piece.x + piece.w / 2;
    const cy = piece.y + piece.h / 2;

    for (const s of game23.slots) {
        const d = Math.hypot(cx - s.x, cy - s.y);
        if (d < bestDist && d < 120) {
            bestDist = d;
            best = s;
        }
    }
    return best;
}

function resetPiecePosition23(p) {
    p.x = p.homeX;
    p.y = p.homeY;
    p.slotId = null;
}

function checkWin23() {
    return game23.slots.every(s => s.filledBy);
}

/* ---------- RENDER ---------- */

function render23() {
    const ctx = game23.ctx;
    const canvas = game23.canvas;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawIceBackground23(ctx, canvas);
    drawIceBoard23(ctx, game23.board);

    for (const s of game23.slots) drawSlot23(ctx, s, game23.colors[s.colorKey]);
    for (const p of game23.pieces) drawPiece23(ctx, p, game23.colors[p.colorKey]);
}

/* ---------- DESSIN ---------- */

function drawIceBackground23(ctx, canvas) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "rgba(125, 249, 255, 0.10)");
    grad.addColorStop(1, "rgba(185, 224, 255, 0.04)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawIceBoard23(ctx, board) {
    const { x, y, size } = board;

    ctx.save();
    ctx.shadowColor = "#7df9ff55";
    ctx.shadowBlur = 40;

    const glass = ctx.createLinearGradient(x, y, x, y + size);
    glass.addColorStop(0, "rgba(120,180,255,0.25)");
    glass.addColorStop(1, "rgba(80,140,255,0.15)");

    ctx.fillStyle = glass;
    ctx.strokeStyle = "#7df9ff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 30);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawSlot23(ctx, slot, neon) {
    ctx.save();

    ctx.strokeStyle = neon;
    ctx.lineWidth = 5;
    ctx.shadowColor = neon + "aa";
    ctx.shadowBlur = 25;

    ctx.beginPath();
    drawShapePath23(ctx, slot.shape, slot.x, slot.y, 45);
    ctx.stroke();

    ctx.restore();
}

function drawPiece23(ctx, p, neon) {
    ctx.save();

    const x = p.x, y = p.y, w = p.w, h = p.h;

    ctx.shadowColor = neon + "aa";
    ctx.shadowBlur = 25;

    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, lighten23(neon, 0.3));
    grad.addColorStop(1, neon);

    ctx.fillStyle = grad;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    drawShapePath23(ctx, p.shape, x + w / 2, y + h / 2, Math.min(w, h) / 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawShapePath23(ctx, shape, cx, cy, r) {
    if (shape === "circle") {
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
    } else if (shape === "square") {
        ctx.rect(cx - r, cy - r, r * 2, r * 2);
    } else if (shape === "triangle") {
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy + r);
        ctx.lineTo(cx - r, cy + r);
        ctx.closePath();
    } else if (shape === "hex") {
        for (let i = 0; i < 6; i++) {
            const a = Math.PI / 3 * i - Math.PI / 6;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    } else if (shape === "cross") {
        const s = r * 0.6;
        ctx.rect(cx - s, cy - r, s * 2, r * 2);
        ctx.rect(cx - r, cy - s, r * 2, s * 2);
    } else if (shape === "drop") {
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx + r, cy - r * 0.2, cx, cy + r);
        ctx.quadraticCurveTo(cx - r, cy - r * 0.2, cx, cy - r);
    } else if (shape === "diamond") {
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
    }
}

function lighten23(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.min(255, Math.floor(r + 255 * amount));
    g = Math.min(255, Math.floor(g + 255 * amount));
    b = Math.min(255, Math.floor(b + 255 * amount));

    return `rgb(${r},${g},${b})`;
}

/* ---------- FIN ---------- */

function setMsg23(text) {
    const el = document.getElementById("msg23");
    if (el) el.textContent = text;
}

function endGame23() {
    game23.gameOver = true;
    setMsg23(" Puzzle terminé ! Tu as suivi la couleur, pas la forme.");
    setTimeout(() => game23.onFinish && game23.onFinish(), 1500);
}
