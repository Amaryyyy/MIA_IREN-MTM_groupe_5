import { gameManager } from "../gameCleanup.js";

let game18 = {};

export function startGame20(container, onFinish) {
    container.innerHTML = `
        <div style="
            display:inline-block;
            background:#050509;
            padding:4px;
            border-radius:8px;
            width:fit-content;
            height:fit-content;
            text-align:center;
            font-family:'VT323', monospace;
            color:white;
        ">
            
            <div style="font-size:1.2em; margin-bottom:10px;">
                🎯 Fléchettes : <span id="darts18" style="color:#00e5ff;">0</span> / 5  
                | Score : <span id="score18" style="color:#ffd34f;">0</span>
            </div>

            <canvas id="dartCanvas" width="520" height="380"
                style="
                    display:block;
                    border:4px solid #ff3860;
                    border-radius:8px;
                    box-shadow:0 0 25px #ff3860aa;
                    cursor:crosshair;
                ">
            </canvas>

            <div style="margin-top:10px;">
                <button id="reset18" style="
                    padding:6px 16px;
                    border-radius:6px;
                    border:none;
                    background:#ff3860;
                    color:#fff;
                    font-size:1em;
                    cursor:pointer;
                ">
                    Recommencer
                </button>
            </div>

            <p id="msg18" style="margin-top:10px; min-height:24px; font-size:1.1em;">
                Tu dois finir avec **5 points** pour gagner.
            </p>
        </div>
    `;

    const canvas = container.querySelector("#dartCanvas");
    const ctx = canvas.getContext("2d");

    game18 = {
        ctx,
        canvas,
        onFinish,
        dartsThrown: 0,
        maxDarts: 5,
        darts: [],
        gravity: 0.25,
        score: 0,

        throwPos: { x: 80, y: 300 },

        target: {
            x: 420,
            y: 180,
            rRed: 20,
            rWhite: 40,
            rBlue: 70
        }
    };

    canvas.addEventListener("click", throwDart18);
    container.querySelector("#reset18").addEventListener("click", resetGame18);

    renderDartGame18();
}

/* ------------------ RESET ------------------ */

function resetGame18() {
    game18.darts = [];
    game18.dartsThrown = 0;
    game18.score = 0;

    document.getElementById("darts18").textContent = 0;
    document.getElementById("score18").textContent = 0;

    document.getElementById("msg18").textContent =
        "+1 si tu rates, -1 si tu touches. Tu dois finir avec 5 points.";

    renderDartGame18();
}

/* ------------------ THROW ------------------ */

function throwDart18(e) {
    if (game18.dartsThrown >= game18.maxDarts) return;

    const rect = game18.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - game18.throwPos.x;
    const dy = my - game18.throwPos.y;

    const angle = Math.atan2(dy, dx);
    const power = Math.min(12, Math.hypot(dx, dy) / 20);

    game18.darts.push({
        x: game18.throwPos.x,
        y: game18.throwPos.y,
        vx: Math.cos(angle) * power,
        vy: Math.sin(angle) * power,
        scored: false,
        stopped: false
    });

    game18.dartsThrown++;
    document.getElementById("darts18").textContent = game18.dartsThrown;

    animateDarts18();
}

/* ------------------ ANIMATION ------------------ */

function animateDarts18() {
    function frame() {
        updateDarts18();
        renderDartGame18();

        if (checkEnd18()) return;

        requestAnimationFrame(frame);
    }
    frame();
}

/* ------------------ UPDATE ------------------ */

function updateDarts18() {
    for (const d of game18.darts) {
        if (d.stopped) continue;

        d.vy += game18.gravity;
        d.x += d.vx;
        d.y += d.vy;

        // Stop si touche le sol
        if (d.y >= game18.canvas.height - 10) {
            d.stopped = true;
        }
    }
}

/* ------------------ SCORING + COLLISIONS ------------------ */

function checkEnd18() {
    const t = game18.target;

    for (const d of game18.darts) {

        if (d.scored) continue;

        const dist = Math.hypot(d.x - t.x, d.y - t.y);

        /* -------------------------
           🎯 COLLISION IMMÉDIATE
        -------------------------- */

        // Centre rouge → reset immédiat
        if (dist <= t.rRed) {
            game18.score -= 1;
            document.getElementById("score18").textContent = game18.score;

            resetGame18();
            document.getElementById("msg18").textContent =
                "❌ Centre rouge ! -1 point. Recommence.";
            return true;
        }

        // Touche la cible (bleu, blanc, rouge)
        if (dist <= t.rBlue) {
            game18.score -= 1;
            d.scored = true;
            d.stopped = true;
            document.getElementById("score18").textContent = game18.score;
            continue;
        }

        /* -------------------------
           🎯 RATE LA CIBLE
        -------------------------- */

        if (d.stopped && !d.scored) {
            game18.score += 1;
            d.scored = true;
            document.getElementById("score18").textContent = game18.score;
        }
    }

    /* -------------------------
       🎯 FIN DES 5 FLÉCHETTES
    -------------------------- */

    if (game18.dartsThrown === game18.maxDarts &&
        game18.darts.every(d => d.scored)) {

        if (game18.score === 5) {
            document.getElementById("msg18").textContent =
                "🎉 BRAVO ! Tu as obtenu 5 points !";
            setTimeout(() => game18.onFinish && game18.onFinish(), 1500);
        } else {
            document.getElementById("msg18").textContent =
                "❌ Tu n'as pas 5 points. Partie perdue !";
            setTimeout(() => resetGame18(), 1500);
        }

        return true;
    }

    return false;
}

/* ------------------ RENDER ------------------ */

function renderDartGame18() {
    const ctx = game18.ctx;
    const { width, height } = game18.canvas;

    // Cadran noir ajusté
    ctx.fillStyle = "#050509";
    ctx.fillRect(6, 6, width - 12, height - 12);

    drawTarget18(ctx, game18.target);

    ctx.fillStyle = "#ff3860";
    for (const d of game18.darts) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = "#86eefa";
    ctx.beginPath();
    ctx.arc(game18.throwPos.x, game18.throwPos.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawTarget18(ctx, t) {
    ctx.fillStyle = "#1b3bff";
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.rBlue, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.rWhite, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff3860";
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.rRed, 0, Math.PI * 2);
    ctx.fill();
}