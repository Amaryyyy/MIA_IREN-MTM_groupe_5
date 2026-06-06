// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

let game20 = {};

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
                🎯 Fléchettes : <span id="darts20" style="color:#00e5ff;">0</span> / 5  
                | Score : <span id="score20" style="color:#ffd34f;">0</span>
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
                <button id="reset20" style="
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

            <p id="msg20" style="margin-top:10px; min-height:24px; font-size:1.1em;">
                Tu dois finir avec **5 points** pour gagner.
            </p>
        </div>
    `;

    const canvas = container.querySelector("#dartCanvas");
    const ctx = canvas.getContext("2d");

    game20 = {
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

    canvas.addEventListener("click", throwDart20);
    container.querySelector("#reset20").addEventListener("click", resetGame20);

    renderDartGame20();
}

/* ------------------ RESET ------------------ */

function resetGame20() {
    game20.darts = [];
    game20.dartsThrown = 0;
    game20.score = 0;

    document.getElementById("darts20").textContent = 0;
    document.getElementById("score20").textContent = 0;

    document.getElementById("msg20").textContent =
        "+1 si tu rates, -1 si tu touches. Tu dois finir avec 5 points.";

    renderDartGame20();
}

/* ------------------ THROW ------------------ */

function throwDart20(e) {
    if (game20.dartsThrown >= game20.maxDarts) return;

    const rect = game20.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - game20.throwPos.x;
    const dy = my - game20.throwPos.y;

    const angle = Math.atan2(dy, dx);
    const power = Math.min(12, Math.hypot(dx, dy) / 20);

    game20.darts.push({
        x: game20.throwPos.x,
        y: game20.throwPos.y,
        vx: Math.cos(angle) * power,
        vy: Math.sin(angle) * power,
        scored: false,
        stopped: false
    });

    game20.dartsThrown++;
    document.getElementById("darts20").textContent = game20.dartsThrown;

    animateDarts20();
}

/* ------------------ ANIMATION ------------------ */

function animateDarts20() {
    function frame() {
        updateDarts20();
        renderDartGame20();

        if (checkEnd20()) return;

        requestAnimationFrame(frame);
    }
    frame();
}

/* ------------------ UPDATE ------------------ */

function updateDarts20() {
    for (const d of game20.darts) {
        if (d.stopped) continue;

        d.vy += game20.gravity;
        d.x += d.vx;
        d.y += d.vy;

        // Stop si touche le sol
        if (d.y >= game20.canvas.height - 10) {
            d.stopped = true;
        }
    }
}

/* ------------------ SCORING + COLLISIONS ------------------ */

function checkEnd20() {
    const t = game20.target;

    for (const d of game20.darts) {

        if (d.scored) continue;

        const dist = Math.hypot(d.x - t.x, d.y - t.y);

        /* -------------------------
           🎯 COLLISION IMMÉDIATE
        -------------------------- */

        // Centre rouge → reset immédiat
        if (dist <= t.rRed) {
            game20.score -= 1;
            document.getElementById("score20").textContent = game20.score;

            resetGame20();
            document.getElementById("msg20").textContent =
                "❌ Centre rouge ! -1 point. Recommence.";
            return true;
        }

        // Touche la cible (bleu, blanc, rouge)
        if (dist <= t.rBlue) {
            game20.score -= 1;
            d.scored = true;
            d.stopped = true;
            document.getElementById("score20").textContent = game20.score;
            continue;
        }

        /* -------------------------
           🎯 RATE LA CIBLE
        -------------------------- */

        if (d.stopped && !d.scored) {
            game20.score += 1;
            d.scored = true;
            document.getElementById("score20").textContent = game20.score;
        }
    }

    /* -------------------------
       🎯 FIN DES 5 FLÉCHETTES
    -------------------------- */

    if (game20.dartsThrown === game20.maxDarts &&
        game20.darts.every(d => d.scored)) {

        if (game20.score === 5) {
            document.getElementById("msg20").textContent =
                "🎉 BRAVO ! Tu as obtenu 5 points !";
            setTimeout(() => game20.onFinish && game20.onFinish(), 1500);
        } else {
            document.getElementById("msg20").textContent =
                "❌ Tu n'as pas 5 points. Partie perdue !";
            setTimeout(() => resetGame20(), 1500);
        }

        return true;
    }

    return false;
}

/* ------------------ RENDER ------------------ */

function renderDartGame20() {
    const ctx = game20.ctx;
    const { width, height } = game20.canvas;

    // Cadran noir ajusté
    ctx.fillStyle = "#050509";
    ctx.fillRect(6, 6, width - 12, height - 12);

    drawTarget20(ctx, game20.target);

    ctx.fillStyle = "#ff3860";
    for (const d of game20.darts) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = "#86eefa";
    ctx.beginPath();
    ctx.arc(game20.throwPos.x, game20.throwPos.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawTarget20(ctx, t) {
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