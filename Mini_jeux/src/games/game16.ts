// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

const GRID_SIZE  = 5;
const CELL_SIZE  = 72;
const TARGET_SUM = 10;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

const LETTERS    = ["A", "B", "C", "D"];
const VALUES     = { A: 1, B: 2, C: 3, D: 4 };
const NEXT_LETTER = { A: "B", B: "C", C: "D", D: "A" };

const PALETTE = {
    A: { fill: "#8bf4fd", glow: "#00eaff", text: "#001a2e" },
    B: { fill: "#e08cf7", glow: "#c800ff", text: "#f5e0ff" },
    C: { fill: "#f44971", glow: "#ff003c", text: "#ffe0e8" },
    D: { fill: "#f6da69", glow: "#ffcc00", text: "#1a1000" },
};

// Stars are generated per-canvas in startGame16 so they scale with display size

let game16 = null;

export function startGame16(container, onFinish) {

    container.innerHTML = `
        <div id="g16-wrap" style="
            font-family: 'VT323', 'Courier New', monospace;
            width: 100vw;
            height: 100vh;
            padding: 18px 0 10px;
            margin: 0;
            background: transparent;
            border-radius: 0;
            border: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        ">
            <div style="text-align:center; margin-bottom: 8px;">
                <span style="
                    display:inline-block;
                    font-size: 24px;
                    letter-spacing: 3px;
                    color: #9a4bff;
                    text-shadow: 0 0 10px rgba(154,75,255,0.9), 0 0 24px rgba(255,200,80,0.06);
                    transform: translateZ(0);
                ">◈ GALAXY SUM ◈</span>
            </div>

            <div id="g16-legend" style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 16px;
                padding: 6px 12px;
                backdrop-filter: blur(4px);
            ">
                ${LETTERS.map(l => `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 6px 14px;
                        border-radius: 8px;
                        background: linear-gradient(180deg, ${PALETTE[l].fill}11, ${PALETTE[l].fill}08);
                        border: 1px solid rgba(255,255,255,0.03);
                        box-shadow: 0 6px 18px ${PALETTE[l].fill}33, inset 0 1px 0 rgba(255,255,255,0.02);
                    ">
                        <span style="
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background: ${PALETTE[l].fill};
                            box-shadow: 0 0 10px ${PALETTE[l].fill};
                            display: inline-block;
                        "></span>
                        <span style="font-size: 13px; color: #cfcff6; opacity: 0.9;">= ${VALUES[l]}</span>
                    </div>
                `).join("")}
            </div>

            <div style="display: flex; justify-content: center;">
                <div style="position: relative;">
                    <canvas
                        id="canvas16"
                        width="${CANVAS_SIZE}"
                        height="${CANVAS_SIZE}"
                        style="
                            border-radius: 10px;
                            border: 1px solid rgba(120,90,200,0.12);
                            display: block;
                            cursor: pointer;
                            box-shadow: 0 18px 40px rgba(10,8,20,0.12), 0 6px 20px rgba(120,90,200,0.04);
                            width: min(62vmin, 70vw);
                            height: min(62vmin, 70vw);
                        "
                    ></canvas>
                    <div id="g16-row-indicators" style="
                        position: absolute;
                        right: -58px;
                        top: 0;
                        height: ${CANVAS_SIZE}px;
                        display: flex;
                        flex-direction: column;
                    "></div>
                </div>
            </div>

            <p id="msg16" style="
                text-align: center;
                margin-top: 14px;
                min-height: 22px;
                font-size: 15px;
                letter-spacing: 1px;
                color: #bfc9ff;
                text-shadow: 0 0 6px rgba(140,140,255,0.08);
            ">CLICK A CELL TO CYCLE ITS COLOR VALUE</p>
        </div>
    `;

    const canvas = container.querySelector("#canvas16");
    const ctx    = canvas.getContext("2d");

    game16 = {
        canvas, ctx, onFinish,
        size:    GRID_SIZE,
        cell:    CELL_SIZE,
        target:  TARGET_SUM,
        status:  "PLAYING",
        hovered: -1,
        tick:    0,
        grid: Array.from(
            { length: GRID_SIZE * GRID_SIZE },
            () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
        ),
        anim: Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({ pop: 0, breath: 0 })),
        particles: [],
        stars: [],
        displaySize: CANVAS_SIZE,
    };

    function resizeCanvas16() {
        const wrapRect = container.getBoundingClientRect();
        // compute display size as a square fitting most of the viewport
        const maxSide = Math.min(window.innerWidth * 0.68, window.innerHeight * 0.60);
        const displaySize = Math.max(120, Math.floor(maxSide));
        const dpr = window.devicePixelRatio || 1;
        // CSS size
        canvas.style.width = displaySize + 'px';
        canvas.style.height = displaySize + 'px';
        // pixel buffer size
        canvas.width = Math.floor(displaySize * dpr);
        canvas.height = Math.floor(displaySize * dpr);
        // scale drawing to CSS pixels
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        game16.cell = displaySize / GRID_SIZE;
        game16.displaySize = displaySize;
        // regenerate stars to match size
        game16.stars = Array.from({ length: 55 }, () => ({
            x: Math.random() * displaySize,
            y: Math.random() * displaySize,
            r: Math.random() * 1.2 + 0.3,
            a: Math.random(),
        }));
        // update row indicators container height
        const indicators = document.getElementById('g16-row-indicators');
        if (indicators) indicators.style.height = displaySize + 'px';
    }

    // initial resize and on-window-resize
    resizeCanvas16();
    gameManager.addEventListener(window, 'resize', resizeCanvas16);

    gameManager.addEventListener(canvas, "click",      handleClick16);
    gameManager.addEventListener(canvas, "mousemove",  handleMouseMove16);
    gameManager.addEventListener(canvas, "mouseleave", handleMouseLeave16);

    renderRowIndicators16();

    const loop = () => {
        game16.tick++;
        render16();
        if (game16.status !== "WIN") requestAnimationFrame(loop);
    };
    loop();
}

/* ── INPUT ─────────────────────────────────────────────────── */

function handleClick16(e) {
    if (game16.status !== "PLAYING") return;
    const { x, y } = getCell16(e);
    if (x < 0) return;
    const idx = y * game16.size + x;
    game16.grid[idx] = NEXT_LETTER[game16.grid[idx]];
    // trigger pop animation
    game16.anim[idx].pop = 1.0;
    // create particle burst
    const cx = x * game16.cell + game16.cell / 2;
    const cy = y * game16.cell + game16.cell / 2;
    const color = PALETTE[game16.grid[idx]].fill;
    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 2.2;
        game16.particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            size: 2 + Math.random() * 2.5,
            life: 36 + Math.floor(Math.random() * 12),
            color: color,
        });
    }
    renderRowIndicators16();
    checkWin16();
}

function handleMouseMove16(e) {
    const { x, y } = getCell16(e);
    const idx = (x < 0) ? -1 : y * game16.size + x;
    if (idx !== game16.hovered) game16.hovered = idx;
}

function handleMouseLeave16() {
    game16.hovered = -1;
}

function getCell16(e) {
    const rect = game16.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const x  = Math.floor(mx / game16.cell);
    const y  = Math.floor(my / game16.cell);
    if (x < 0 || y < 0 || x >= game16.size || y >= game16.size) return { x: -1, y: -1 };
    return { x, y };
}

/* ── GAME LOGIC ─────────────────────────────────────────────── */

function checkWin16() {
    for (let row = 0; row < game16.size; row++) {
        if (rowSum16(row) !== game16.target) {
            setMessage16("KEEP GOING...");
            return;
        }
    }
    game16.status = "WIN";
    setMessage16("◈ PERFECT — ALL ROWS COMPLETE ◈");
    document.getElementById("msg16").style.color = "#ffcc00";
    document.getElementById("msg16").style.textShadow = "0 0 10px #ffcc00";
    setTimeout(game16.onFinish, 1800);
}

function rowSum16(row) {
    return Array.from({ length: game16.size }, (_, col) =>
        VALUES[game16.grid[row * game16.size + col]]
    ).reduce((a, b) => a + b, 0);
}

/* ── ROW INDICATORS (right side — check / cross only) ───────── */

function renderRowIndicators16() {
    const el = document.getElementById("g16-row-indicators");
    if (!el) return;
    el.innerHTML = Array.from({ length: game16.size }, (_, row) => {
        const done = rowSum16(row) === game16.target;
        return `
            <div style="
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: ${done ? "#00ff99" : "#1a1a3a"};
                text-shadow: ${done ? "0 0 8px #00ff99" : "none"};
                transition: color 0.2s;
            ">${done ? "✓" : "·"}</div>
        `;
    }).join("");
}

/* ── RENDER ─────────────────────────────────────────────────── */

function render16() {
    const { ctx, size, cell, grid, hovered, tick, anim, particles } = game16;

    // clear canvas (transparent background) and draw starfield
    ctx.clearRect(0, 0, game16.displaySize, game16.displaySize);
    drawStars16(ctx, tick);

    // update animations
    for (let i = 0; i < anim.length; i++) {
        if (anim[i].pop > 0) {
            anim[i].pop -= 0.06;
            if (anim[i].pop < 0) anim[i].pop = 0;
        } else {
            anim[i].breath = 0.012 * Math.sin(tick * 0.06 + i);
        }
    }

    // row highlight when the row sum matches the target
    for (let row = 0; row < size; row++) {
        if (rowSum16(row) === game16.target) {
            const y = row * game16.cell;
            const grad = ctx.createLinearGradient(0, y, 0, y + game16.cell);
            grad.addColorStop(0, 'rgba(255, 220, 120, 0.06)');
            grad.addColorStop(0.5, 'rgba(255, 220, 120, 0.04)');
            grad.addColorStop(1, 'rgba(255, 220, 120, 0.02)');
            ctx.save();
            ctx.fillStyle = grad;
            ctx.fillRect(0, y, game16.displaySize, game16.cell);
            // slight glow
            ctx.shadowColor = 'rgba(255,220,120,0.18)';
            ctx.shadowBlur = 18;
            ctx.fillRect(0, y, game16.displaySize, game16.cell);
            ctx.restore();
        }
    }

    grid.forEach((letter, idx) => {
        const col = idx % size;
        const row = Math.floor(idx / size);
        const scale = 1 + anim[idx].pop * 0.22 + (idx === hovered ? 0.06 : anim[idx].breath || 0);
        drawTile16(ctx, col * cell, row * cell, letter, idx === hovered, tick, scale);
    });

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life -= 1;
        if (p.life <= 0) particles.splice(i, 1);
        else {
            // bubble base with radial gradient to simulate volume
            const grad = ctx.createRadialGradient(
                p.x - p.size * 0.25,
                p.y - p.size * 0.35,
                Math.max(1, p.size * 0.1),
                p.x,
                p.y,
                Math.max(1, p.size)
            );
            // white specular near the top-left, then the particle color, then transparent
            grad.addColorStop(0, 'rgba(255,255,255,0.95)');
            grad.addColorStop(0.18, p.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.globalAlpha = Math.max(0, p.life / 48);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // small bright specular ellipse for sharper reflection
            const sx = p.x - (p.vx * 0.08);
            const sy = p.y - (p.vy * 0.08) - (p.size * 0.25);
            const sRadius = Math.max(0.6, p.size * 0.45);
            ctx.beginPath();
            ctx.ellipse(sx, sy, sRadius, sRadius * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, 0.25 + (p.life/48)*0.75)})`;
            ctx.fill();

            // subtle rim highlight
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size - 0.3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${0.08 + (Math.max(0, p.life/48))*0.12})`;
            ctx.lineWidth = Math.max(0.6, p.size * 0.12);
            ctx.stroke();

            ctx.globalAlpha = 1;
        }
    }

    drawGridLines16(ctx);
}

function drawStars16(ctx, tick) {
    const stars = (game16 && game16.stars) ? game16.stars : [];
    stars.forEach(s => {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.018 + s.a * 10));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 180, 255, ${twinkle * 0.6})`;
        ctx.fill();
    });
}

function drawTile16(ctx, x, y, letter, isHovered, tick, scale = 1) {
    const PAD = 5;
    const RAD = 10;
    const p   = PALETTE[letter];
    const pulse = isHovered
        ? 1
        : 0.78 + 0.22 * Math.abs(Math.sin(tick * 0.04 + (x + y) * 0.15));
    const cx = x + game16.cell / 2;
    const cy = y + game16.cell / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    // Full-color circular tile base
    const radius = (game16.cell - PAD * 2) / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.fill;
    ctx.fill();

    // Top gloss (radial highlight)
    const rg = ctx.createRadialGradient(cx, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
    rg.addColorStop(0, 'rgba(255,255,255,0.22)');
    rg.addColorStop(0.25, 'rgba(255,255,255,0.12)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy - radius * 0.12, radius * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = rg;
    ctx.fill();

    // Inner stroke and shadow for depth
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.28)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = isHovered ? 20 : 8 * pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

function drawGridLines16(ctx) {
    ctx.strokeStyle = "rgba(80, 80, 180, 0.12)";
    ctx.lineWidth   = 1;
    const sizePx = game16.displaySize;
    const cell = game16.cell;
    for (let i = 1; i < GRID_SIZE; i++) {
        const x = i * cell;
        const y = i * cell;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, sizePx); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(sizePx, y); ctx.stroke();
    }
}

/* ── HELPERS ─────────────────────────────────────────────────── */

function setMessage16(msg) {
    const el = document.getElementById("msg16");
    if (el) el.textContent = msg;
}

function roundRect16(ctx, x, y, w, h, r) {
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