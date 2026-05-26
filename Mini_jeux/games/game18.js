import { gameManager } from "../gameCleanup.js";

let game16 = {};

const EVEN_COLORS = new Set(["A", "B"]);
const ODD_COLORS  = new Set(["C", "D"]);

export function startGame18(container, onFinish) {
    container.innerHTML = `
        <div style="
            text-align:center;
            font-family: 'Segoe UI', sans-serif;
            color: white;
            width: 100vw;
            min-height: 100vh;
            padding: 18px 16px 14px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: transparent;
        ">
            <div style="font-size: 1.2em; margin-bottom: 10px; font-family: 'VT323', monospace; color: #cfe8ff; text-shadow: 0 0 8px rgba(0,229,255,0.15);">
                🔄 Mouvements : <span id="moves16" style="color: #00e5ff;">0</span>
            </div>
            <canvas id="flipCanvas" width="400" height="400"
                style="
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    box-shadow: 0 14px 30px rgba(0,0,0,0.10);
                    cursor: pointer;
                    display: block;
                    width: min(60vmin, 66vw, 66vh);
                    height: min(60vmin, 66vw, 66vh);
                    background: rgba(255,255,255,0.02);
                ">
            </canvas>
            <p id="msg16" style="margin-top: 15px; font-weight: bold; min-height: 24px; font-family: 'VT323', monospace; color: #d8f3ff; text-shadow: 0 0 8px rgba(0,229,255,0.12);">
                Retournez les cases pour former un damier !
            </p>
        </div>
    `;

    const canvas = container.querySelector("#flipCanvas");
    const ctx = canvas.getContext("2d");

    game16 = {
        ctx, canvas,
        size: 5,
        tileSize: 80,
        grid: [],
        moves: 0,
        onFinish,
        status: "PLAYING",
        displaySize: 400,

        // 🎨 Couleurs rétro-gaming
        colors: {
            A: "#5500ff", // rose néon
            B: "#f800fc", // rouge néon
            C: "#00e0f9", // cyan électrique
            D: "#ff7300"  // bleu saturé
        }
    };

    initFlipPuzzle();
    resizeFlipPuzzle();
    gameManager.addEventListener(window, "resize", resizeFlipPuzzle);
    canvas.addEventListener("click", clickFlipPuzzle);
    renderFlipPuzzle();
}

/* ------------------ INIT ------------------ */

function initFlipPuzzle() {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const idx = y * 5 + x;

            // Cases (x+y) pairs → type AB (pour pouvoir afficher A)
            // Cases (x+y) impairs → type CD (pour pouvoir afficher C)
            const type = ((x + y) % 2 === 0) ? "AB" : "CD";

            // Face aléatoire (recto/verso)
            const face = Math.random() < 0.5 ? 0 : 1;

            game16.grid[idx] = { type, face };
        }
    }
}

/* ------------------ CLICK ------------------ */

function clickFlipPuzzle(e) {
    if (game16.status !== "PLAYING") return;

    const rect = game16.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const x = Math.floor(mx / game16.tileSize);
    const y = Math.floor(my / game16.tileSize);
    const idx = y * 5 + x;

    if (x < 0 || y < 0 || x >= game16.size || y >= game16.size) return;

    // Retourner la case
    game16.grid[idx].face = 1 - game16.grid[idx].face;

    game16.moves++;
    document.getElementById("moves16").textContent = game16.moves;

    renderFlipPuzzle();
    checkFlipWin();
}

/* ------------------ CHECK WIN ------------------ */

function checkFlipWin() {
    let evenColor = null;
    let oddColor = null;

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const idx = y * 5 + x;
            const cell = game16.grid[idx];

            const colorKey = getCellKey(cell);
            const isEven = ((x + y) % 2 === 0);

            if (isEven) {
                if (!EVEN_COLORS.has(colorKey)) return;
                if (evenColor === null) evenColor = colorKey;
                if (colorKey !== evenColor) return;
            } else {
                if (!ODD_COLORS.has(colorKey)) return;
                if (oddColor === null) oddColor = colorKey;
                if (colorKey !== oddColor) return;
            }
        }
    }

    // Si on arrive ici → victoire
    game16.status = "WIN";
    document.getElementById("msg16").textContent = "🎉 Damier complété !";
    setTimeout(game16.onFinish, 1500);
}

/* ------------------ GET COLOR ------------------ */

function getCellColor(cell) {
    if (cell.type === "AB") {
        return cell.face === 0 ? game16.colors.A : game16.colors.B;
    } else {
        return cell.face === 0 ? game16.colors.C : game16.colors.D;
    }
}

function resizeFlipPuzzle() {
    const canvas = game16.canvas;
    const ctx = game16.ctx;
    const maxSide = Math.min(window.innerWidth * 0.60, window.innerHeight * 0.60);
    const displaySize = Math.max(220, Math.floor(maxSide));
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
    canvas.width = Math.floor(displaySize * dpr);
    canvas.height = Math.floor(displaySize * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    game16.displaySize = displaySize;
    game16.tileSize = displaySize / game16.size;
}

function getCellKey(cell) {
    if (cell.type === "AB") {
        return cell.face === 0 ? "A" : "B";
    }
    return cell.face === 0 ? "C" : "D";
}

/* ------------------ RENDER ------------------ */

function renderFlipPuzzle() {
    const ctx = game16.ctx;
    ctx.clearRect(0, 0, game16.displaySize, game16.displaySize);

    const tile = game16.tileSize;
    const pad = Math.max(4, tile * 0.06);
    const inner = tile - pad * 2;

    for (let i = 0; i < 25; i++) {
        const cell = game16.grid[i];
        const color = getCellColor(cell);

        const x = (i % 5) * game16.tileSize;
        const y = Math.floor(i / 5) * game16.tileSize;

        // Effet glossy rétro
        const gradient = ctx.createLinearGradient(x, y, x + tile, y + tile);
        gradient.addColorStop(0, lighten(color, 0.25));
        gradient.addColorStop(1, color);

        ctx.fillStyle = gradient;
        roundRect(ctx, x + pad, y + pad, inner, inner, Math.max(8, tile * 0.12));
        ctx.fill();

        // Glow néon
        ctx.strokeStyle = color + "aa";
        ctx.lineWidth = Math.max(2, tile * 0.04);
        ctx.stroke();
    }
}

/* ------------------ COLOR UTILS ------------------ */

function lighten(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) + Math.floor(255 * amount);
    let g = ((num >> 8) & 0xFF) + Math.floor(255 * amount);
    let b = (num & 0xFF) + Math.floor(255 * amount);

    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);

    return `rgb(${r},${g},${b})`;
}

function roundRect(ctx, x, y, w, h, r) {
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
}
