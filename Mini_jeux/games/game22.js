import { gameManager } from "../gameCleanup.js";let game20 = {};

export function startGame22(container, onFinish) {
    container.innerHTML = `
        <div id="game22Wrap" style="position:relative; text-align:center; font-family:'VT323', monospace; color:white; background:transparent; padding:20px; border-radius:15px; overflow:hidden;">
            <canvas id="tetrisCanvas20" width="200" height="400"
                style="border:4px solid #6f7cff; border-radius:8px; box-shadow:0 0 25px rgba(111,124,255,0.28); background:#050509;">
            </canvas>
            <div id="game22Victory" style="display:none; position:absolute; inset:0; z-index:5; align-items:center; justify-content:center; background:rgba(5,5,9,0.72); backdrop-filter:blur(3px);">
                <div style="position:relative; width:100%; height:100%; overflow:hidden;">
                    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;">
                        <div style="padding:18px 28px; border:3px solid #6f7cff; border-radius:16px; background:rgba(7,8,16,0.92); box-shadow:0 0 30px rgba(111,124,255,0.45), 0 0 60px rgba(0,229,255,0.15); text-transform:uppercase; letter-spacing:3px; font-size:42px; color:#ffffff; text-shadow:0 0 14px rgba(255,255,255,0.7), 0 0 22px rgba(111,124,255,0.55);">
                            You Won
                        </div>
                    </div>
                    <div id="game22Confetti" aria-hidden="true" style="position:absolute; inset:0; pointer-events:none;"></div>
                </div>
            </div>
        </div>
    `;

    const canvas = container.querySelector("#tetrisCanvas20");
    const ctx = canvas.getContext("2d");

    game20 = {
        ctx,
        canvas,
        onFinish,
        cols: 10,
        rows: 20,
        cellSize: 20,
        grid: [],
        current: null,
        currentX: 0,
        currentY: 0,
        currentShapeIndex: 0,
        gameOver: false,
        won: false,
        dropInterval: 600,
        lastDrop: 0
    };

    // init grid
    for (let r = 0; r < game20.rows; r++) {
        game20.grid[r] = new Array(game20.cols).fill(0);
    }

    window.addEventListener("keydown", handleKey20);
    spawnPiece20();
    requestAnimationFrame(loop20);
}

/* ---------- PIECES ---------- */

const SHAPES20 = [
    // I
    [
        [1, 1, 1, 1]
    ],
    // O
    [
        [1, 1],
        [1, 1]
    ],
    // T
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    // L
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    // J
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    // S
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ]
];

function spawnPiece20() {
    const idx = Math.floor(Math.random() * SHAPES20.length);
    game20.currentShapeIndex = idx;
    game20.current = SHAPES20[idx].map(row => row.slice());
    game20.currentX = Math.floor(game20.cols / 2) - Math.floor(game20.current[0].length / 2);
    game20.currentY = 0;

    if (collides20(game20.currentX, game20.currentY, game20.current)) {
        endGame20(false);
    }
}

/* ---------- INPUT ---------- */

function handleKey20(e) {
    if (game20.gameOver) return;

    if (e.code === "ArrowLeft") {
        e.preventDefault();
        movePiece20(-1);
    } else if (e.code === "ArrowRight") {
        e.preventDefault();
        movePiece20(1);
    } else if (e.code === "ArrowDown") {
        e.preventDefault();
        softDrop20();
    } else if (e.code === "ArrowUp") {
        e.preventDefault();
        rotatePiece20();
    } else if (e.code === "Space") {
        e.preventDefault();
        hardDrop20();
    }
}

function movePiece20(dir) {
    const nx = game20.currentX + dir;
    if (!collides20(nx, game20.currentY, game20.current)) {
        game20.currentX = nx;
    }
}

function softDrop20() {
    const ny = game20.currentY + 1;
    if (!collides20(game20.currentX, ny, game20.current)) {
        game20.currentY = ny;
    } else {
        lockPiece20();
    }
}

function hardDrop20() {
    while (!collides20(game20.currentX, game20.currentY + 1, game20.current)) {
        game20.currentY++;
    }
    lockPiece20();
}

function rotatePiece20() {
    const rotated = rotateMatrix20(game20.current);
    if (!collides20(game20.currentX, game20.currentY, rotated)) {
        game20.current = rotated;
    }
}

/* ---------- COLLISIONS & LOCK ---------- */

function collides20(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const gx = x + c;
            const gy = y + r;
            if (gx < 0 || gx >= game20.cols || gy >= game20.rows) return true;
            if (gy >= 0 && game20.grid[gy][gx]) return true;
        }
    }
    return false;
}

function lockPiece20() {
    const shape = game20.current;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const gx = game20.currentX + c;
            const gy = game20.currentY + r;
            if (gy >= 0 && gy < game20.rows && gx >= 0 && gx < game20.cols) {
                game20.grid[gy][gx] = game20.currentShapeIndex + 1;
            }
        }
    }

    // ici, on NE supprime PAS les lignes : le but est de remplir
    if (hasIrrecoverableHole20()) {
        resetGame20();
        return;
    }

    if (isGridMoreThanHalfFull20()) {
        endGame20(true);
        return;
    }

    spawnPiece20();
}

/* ---------- FULL GRID CHECK ---------- */

function isGridMoreThanHalfFull20() {
    let filled = 0;
    const total = game20.rows * game20.cols;

    for (let r = 0; r < game20.rows; r++) {
        for (let c = 0; c < game20.cols; c++) {
            if (game20.grid[r][c]) filled++;
        }
    }

    return filled > total * 0.65;
}

function hasIrrecoverableHole20() {
    const reachable = Array.from({ length: game20.rows }, () => new Array(game20.cols).fill(false));
    const stack = [];

    for (let c = 0; c < game20.cols; c++) {
        if (!game20.grid[0][c]) {
            reachable[0][c] = true;
            stack.push([0, c]);
        }
    }

    while (stack.length > 0) {
        const [r, c] = stack.pop();
        const neighbors = [
            [r - 1, c],
            [r + 1, c],
            [r, c - 1],
            [r, c + 1]
        ];

        for (const [nr, nc] of neighbors) {
            if (nr < 0 || nr >= game20.rows || nc < 0 || nc >= game20.cols) continue;
            if (reachable[nr][nc]) continue;
            if (game20.grid[nr][nc]) continue;
            reachable[nr][nc] = true;
            stack.push([nr, nc]);
        }
    }

    for (let r = 0; r < game20.rows; r++) {
        for (let c = 0; c < game20.cols; c++) {
            if (!game20.grid[r][c] && !reachable[r][c]) return true;
        }
    }

    return false;
}

function resetGame20() {
    for (let r = 0; r < game20.rows; r++) {
        game20.grid[r].fill(0);
    }

    game20.current = null;
    game20.currentX = 0;
    game20.currentY = 0;
    game20.currentShapeIndex = 0;
    game20.gameOver = false;
    game20.lastDrop = 0;

    spawnPiece20();
}

/* ---------- LOOP ---------- */

function loop20(timestamp) {
    if (game20.gameOver) {
        render20();
        return;
    }

    if (!game20.lastDrop) game20.lastDrop = timestamp;
    const delta = timestamp - game20.lastDrop;

    if (delta > game20.dropInterval) {
        game20.lastDrop = timestamp;
        softDrop20();
    }

    render20();
    requestAnimationFrame(loop20);
}

/* ---------- RENDER ---------- */

function render20() {
    const ctx = game20.ctx;
    const { width, height } = game20.canvas;
    ctx.clearRect(0, 0, width, height);

    // grille
    ctx.strokeStyle = "#111320";
    ctx.lineWidth = 1;
    for (let x = 0; x <= game20.cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * game20.cellSize, 0);
        ctx.lineTo(x * game20.cellSize, height);
        ctx.stroke();
    }
    for (let y = 0; y <= game20.rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * game20.cellSize);
        ctx.lineTo(width, y * game20.cellSize);
        ctx.stroke();
    }

    // cases fixes
    for (let r = 0; r < game20.rows; r++) {
        for (let c = 0; c < game20.cols; c++) {
            const v = game20.grid[r][c];
            if (!v) continue;
            drawCell20(c, r, colorFor20(v));
        }
    }

    // pièce courante
    if (game20.current && !game20.gameOver) {
        const shape = game20.current;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) continue;
                const gx = game20.currentX + c;
                const gy = game20.currentY + r;
                if (gy >= 0) {
                    drawCell20(gx, gy, colorFor20(game20.currentShapeIndex + 1), true);
                }
            }
        }
    }

    renderVictory20();
}

function drawCell20(cx, cy, color, glow = false) {
    const ctx = game20.ctx;
    const size = game20.cellSize;
    const x = cx * size;
    const y = cy * size;

    if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

    ctx.shadowBlur = 0;
}

/* ---------- COLORS & UTILS ---------- */

function colorFor20(v) {
    const colors = [
        "#00e5ff",
        "#ff3860",
        "#ff9df8",
        "#afff9f",
        "#f5e960",
        "#9f86ff",
        "#ffb86c"
    ];
    return colors[(v - 1) % colors.length];
}

function rotateMatrix20(mat) {
    const rows = mat.length;
    const cols = mat[0].length;
    const res = [];
    for (let c = 0; c < cols; c++) {
        const row = [];
        for (let r = rows - 1; r >= 0; r--) {
            row.push(mat[r][c]);
        }
        res.push(row);
    }
    return res;
}

/* ---------- END GAME ---------- */

function endGame20(win) {
    game20.gameOver = true;
    game20.won = win;
    if (win) {
        showVictory20();
    }
    setTimeout(() => game20.onFinish && game20.onFinish(), 1500);
}

function showVictory20() {
    const overlay = document.getElementById("game22Victory");
    const confettiHost = document.getElementById("game22Confetti");

    if (overlay) {
        overlay.style.display = "flex";
    }

    if (!confettiHost || confettiHost.dataset.spawned === "true") return;
    confettiHost.dataset.spawned = "true";
    confettiHost.innerHTML = "";

    const colors = ["#00e5ff", "#ff3860", "#ff9df8", "#afff9f", "#f5e960", "#9f86ff", "#ffb86c", "#ffffff"];
    const pieceCount = 90;

    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement("span");
        const size = 6 + Math.random() * 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 1.1;
        const duration = 2.6 + Math.random() * 2.8;
        const drift = (Math.random() * 2 - 1) * 110;
        const spin = (Math.random() * 2 - 1) * 540;
        const color = colors[Math.floor(Math.random() * colors.length)];

        piece.style.position = "absolute";
        piece.style.left = `${left}%`;
        piece.style.top = "-12%";
        piece.style.width = `${size}px`;
        piece.style.height = `${size * (0.45 + Math.random() * 0.9)}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? "999px" : "2px";
        piece.style.background = color;
        piece.style.boxShadow = `0 0 10px ${color}`;
        piece.style.opacity = String(0.85 + Math.random() * 0.15);
        piece.style.transform = `translate3d(0, 0, 0) rotate(${Math.random() * 360}deg)`;
        piece.style.setProperty("--fall-duration", `${duration}s`);
        piece.style.setProperty("--fall-delay", `${delay}s`);
        piece.style.setProperty("--drift", `${drift}px`);
        piece.style.setProperty("--spin", `${spin}deg`);
        piece.style.animation = `game22ConfettiFall var(--fall-duration) linear var(--fall-delay) forwards`;

        confettiHost.appendChild(piece);
    }

    if (!document.getElementById("game22ConfettiStyles")) {
        const style = document.createElement("style");
        style.id = "game22ConfettiStyles";
        style.textContent = `
            @keyframes game22ConfettiFall {
                0% {
                    transform: translate3d(0, -18px, 0) rotate(0deg);
                }
                100% {
                    transform: translate3d(var(--drift), 470px, 0) rotate(var(--spin));
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function renderVictory20() {
    if (!game20.won) return;

    const confettiHost = document.getElementById("game22Confetti");
    if (!confettiHost) return;

    const pieces = confettiHost.children;
    for (const piece of pieces) {
        const currentOpacity = parseFloat(piece.style.opacity || "1");
        piece.style.opacity = String(Math.max(0, currentOpacity - 0.0025));
    }
}
