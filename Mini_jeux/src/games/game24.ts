// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

let game22 = {};

export function startGame24(container, onFinish) {
    container.innerHTML = `
        <div style="text-align:center; font-family:'VT323', monospace; color:white; background:#050509; padding:20px; border-radius:15px;">
            <h2 style="margin:0 0 8px;">🚰 Robinets à l'envers — Logique contrariée</h2>
            <p style="margin:0 0 8px; font-size:0.95em;">
                Clique sur un robinet (A, B, C, D).<br>
                Rien ne se passe comme prévu : l'eau sort d'un autre robinet, et parfois dans le mauvais sens...
            </p>

            <canvas id="tapCanvas22" width="800" height="400"
                style="border:4px solid #7fd3ff; border-radius:8px; box-shadow:0 0 25px #7fd3ffaa; background:#041018;">
            </canvas>

            <p id="msg22" style="margin-top:8px; min-height:24px; font-size:1.05em;">
                Objectif : remplir le réservoir à 60%. Observe la contre-logique des robinets.
            </p>
        </div>
    `;

    const canvas = container.querySelector("#tapCanvas22");
    const ctx = canvas.getContext("2d");

    // preload spritesheet for pipes
    const sprite = new Image();
    sprite.src = "assets/images/Tuyaux.jpg";
    // sprite source rectangles (approximate) - adjust if needed
    const spriteRects = {
        straight: { x: 20, y: 20, w: 280, h: 80 },
        elbow: { x: 20, y: 120, w: 180, h: 220 },
        faucet: { x: 220, y: 20, w: 180, h: 140 },
        cross: { x: 220, y: 180, w: 160, h: 180 },
        ysplit: { x: 420, y: 20, w: 180, h: 220 },
        cracked: { x: 620, y: 20, w: 240, h: 200 }
    };

    game22 = {
        ctx,
        canvas,
        onFinish,
        taps: {
            A: false,
            B: false,
            C: false,
            D: false
        },
        // point de jonction pour le réseau de tuyaux
        pipeJunction: { x: canvas.width / 2, y: canvas.height / 2 },
        // connexions entre robinets et la jonction
        pipes: [
            { from: 'A', to: 'junction' },
            { from: 'B', to: 'junction' },
            { from: 'C', to: 'junction' }
        ],
        // pieces: represent if the pipe between tap and junction is oriented/connected
        pieces: {
            A: { connected: true },
            B: { connected: true },
            C: { connected: true },
            junctionToReservoir: { connected: true }
        },
        sprite,
        spriteRects,
        flowDir: 1,       // 1 = remplit, -1 = vide
        dEnabled: true,   // C active/désactive D comme source
        aMode: 1,         // 1 = inversion simple, 2 = double inversion
        reservoir: 0,     // 0 à 100
        gameOver: false,
        tapLayout: {
            A: { x: 150, y: 120 },
            B: { x: 650, y: 120 },
            C: { x: 150, y: 280 },
            D: { x: 650, y: 280 }
        }
    };

    canvas.addEventListener("click", onCanvasClick22);
    render22();
}

/* ---------- LOGIQUE DES ROBINETS ---------- */
/*
Contre-logique :
- Cliquer un robinet ne fait pas couler l'eau de ce robinet.
- Chaque robinet modifie un autre robinet ou le système :
    A : inverse l'état de C (et parfois aussi B)
    B : inverse le sens du flux (remplit / vide)
    C : active/désactive D comme source d'eau
    D : change le mode de A (simple ou double inversion)
- L'eau sort du robinet opposé à celui cliqué :
    A <-> C, B <-> D
- L'eau ne coule que si ce robinet opposé est OUVERT
  (et si D est activé quand c'est lui la source).
*/

function onCanvasClick22(e) {
    if (game22.gameOver) return;

    const rect = game22.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tap = tapAt22(x, y);
    if (!tap) {
        // check if clicked on a pipe segment (toggle piece connection)
        for (const p of game22.pipes) {
            const from = p.from === 'junction' ? game22.pipeJunction : game22.tapLayout[p.from];
            const to = p.to === 'junction' ? game22.pipeJunction : game22.tapLayout[p.to];
            const d = pointToSegmentDistance22({ x, y }, from, to);
            if (d < 18) {
                // toggle piece for this pipe
                if (game22.pieces && game22.pieces[p.from]) {
                    game22.pieces[p.from].connected = !game22.pieces[p.from].connected;
                    setMsg22(`Tu as basculé la pièce ${p.from} => ${game22.pieces[p.from].connected ? 'CONNECTÉE' : 'DÉCONNECTÉE'}`);
                    render22();
                    return;
                }
            }
        }
        // click near junction->reservoir
        const junction = game22.pipeJunction;
        const jrMid = { x: junction.x, y: junction.y + 25 };
        const dj = Math.hypot(x - jrMid.x, y - jrMid.y);
        if (dj < 20 && game22.pieces && game22.pieces.junctionToReservoir) {
            game22.pieces.junctionToReservoir.connected = !game22.pieces.junctionToReservoir.connected;
            setMsg22(`Jonction→benne ${game22.pieces.junctionToReservoir.connected ? 'CONNECTÉE' : 'DÉCONNECTÉE'}`);
            render22();
            return;
        }
        return;
    }

    // If clicked directly on a tap handle, handle tap logic
    handleTapLogic22(tap);
    render22();
    checkWin22();
}

function tapAt22(x, y) {
    for (const key of Object.keys(game22.tapLayout)) {
        const t = game22.tapLayout[key];
        const dx = x - t.x;
        const dy = y - t.y;
        if (dx * dx + dy * dy <= 35 * 35) return key;
    }
    return null;
}

function pointToSegmentDistance22(p, a, b) {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const apx = p.x - a.x;
    const apy = p.y - a.y;
    const ab2 = abx * abx + aby * aby;
    if (ab2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    let t = (apx * abx + apy * aby) / ab2;
    t = Math.max(0, Math.min(1, t));
    const projx = a.x + abx * t;
    const projy = a.y + aby * t;
    return Math.hypot(p.x - projx, p.y - projy);
}

function handleTapLogic22(tap) {
    const state = game22;

    // 1) On "tourne" le robinet : on inverse son état (ouvert/fermé)
    state.taps[tap] = !state.taps[tap];
    // Rotation visuelle / bascule de la pièce associée (simule rotation)
    if (state.pieces && state.pieces[tap]) {
        state.pieces[tap].connected = !state.pieces[tap].connected;
    }

    // 2) Effets secondaires non intuitifs
    if (tap === "A") {
        // A inverse C, et en mode 2 inverse aussi B
        state.taps.C = !state.taps.C;
        if (state.aMode === 2) {
            state.taps.B = !state.taps.B;
        }
    } else if (tap === "B") {
        // B inverse le sens du flux
        state.flowDir *= -1;
    } else if (tap === "C") {
        // C active/désactive D comme source
        state.dEnabled = !state.dEnabled;
    } else if (tap === "D") {
        // D change le mode de A
        state.aMode = state.aMode === 1 ? 2 : 1;
    }

    // 3) L'eau sort du robinet opposé
    const oppositeMap = { A: "C", C: "A", B: "D", D: "B" };
    const source = oppositeMap[tap];
    // Source must be open AND its piece connected to junction AND junction->reservoir connected
    let canFlow = !!state.taps[source];
    if (source === "D" && !state.dEnabled) canFlow = false;
    // check pieces connectivity
    if (canFlow) {
        const piece = state.pieces && state.pieces[source];
        const jr = state.pieces && state.pieces.junctionToReservoir;
        if (piece && !piece.connected) canFlow = false;
        if (jr && !jr.connected) canFlow = false;
    }

    if (canFlow) {
        // flux dans le sens actuel
        state.reservoir += 10 * state.flowDir;
        if (state.reservoir < 0) state.reservoir = 0;
        if (state.reservoir > 100) state.reservoir = 100;

        const dirText = state.flowDir === 1 ? "remplit" : "vide";
        setMsg22(
            `L'eau sort de ${source} (pièce connectée) et ${dirText} le réservoir (${state.reservoir}%).`
        );
    } else {
        setMsg22(
            `Tu as tourné ${tap}, mais l'eau ne coule pas : vérifie les pièces/tuyaux.`
        );
    }
}

/* ---------- AFFICHAGE ---------- */

function render22() {
    const ctx = game22.ctx;
    const canvas = game22.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond
    ctx.fillStyle = "#041018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tuyau central
    ctx.strokeStyle = "#1f3b4d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(200, canvas.height / 2);
    ctx.lineTo(canvas.width - 200, canvas.height / 2);
    ctx.stroke();

    // Dessine le réseau de tuyaux reliant A, B, C à la jonction
    drawPipes22(ctx);

    // Robinets
    for (const key of Object.keys(game22.tapLayout)) {
        const t = game22.tapLayout[key];
        drawTap22(ctx, t.x, t.y, key, game22.taps[key]);
    }

    // Flèche de direction du flux
    drawFlowDirection22(ctx);

    // Réservoir
    drawReservoir22(ctx);
}

function drawPipes22(ctx) {
    const junction = game22.pipeJunction;

    ctx.save();
    // pipe body
    ctx.strokeStyle = '#16343f';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';

    for (const p of game22.pipes) {
        const from = p.from === 'junction' ? junction : game22.tapLayout[p.from];
        const to = p.to === 'junction' ? junction : game22.tapLayout[p.to];
        // determine if this pipe is currently connected (piece state)
        const key = p.from;
        const piece = game22.pieces && game22.pieces[key];
        const active = piece ? piece.connected : true;
        // If sprite sheet loaded, draw sprite oriented between points
        if (game22.sprite && game22.spriteRects) {
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.hypot(dx, dy);
            const ang = Math.atan2(dy, dx);
            const midx = (from.x + to.x) / 2;
            const midy = (from.y + to.y) / 2;

            // choose a sprite variant based on index to use different tiles from the sheet
            const variants = Object.keys(game22.spriteRects);
            const idx = game22.pipes.indexOf(p) % variants.length;
            const name = variants[idx];
            const rect = game22.spriteRects[name];

            const tileH = 60; // draw height for pipe tile

            ctx.save();
            ctx.translate(midx, midy);
            ctx.rotate(ang);
            try {
                ctx.drawImage(game22.sprite, rect.x, rect.y, rect.w, rect.h, -len / 2, -tileH / 2, len, tileH);
            } catch (e) {
                // fallback to simple line on error
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.strokeStyle = '#16343f';
                ctx.lineWidth = 14;
                ctx.stroke();
            }
            ctx.restore();

            // overlay inner color to indicate active/inactive
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = active ? '#2b6b85' : '#444';
            ctx.lineWidth = 6;
            ctx.stroke();

            continue;
        }
    }

    // Draw junction circle
    ctx.fillStyle = '#0f2a33';
    ctx.strokeStyle = '#7fd3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(junction.x, junction.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // draw pipe from junction to reservoir and show active/inactive
    const jr = game22.pieces && game22.pieces.junctionToReservoir;
    const jrActive = jr ? jr.connected : true;
    const rx = junction.x;
    const ry = junction.y + 50;
    if (game22.sprite && game22.spriteRects) {
        const from = junction;
        const to = { x: rx, y: ry };
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        const midx = (from.x + to.x) / 2;
        const midy = (from.y + to.y) / 2;
        const rect = game22.spriteRects.straight;
        const tileH = 60;
        ctx.save();
        ctx.translate(midx, midy);
        ctx.rotate(ang);
        try {
            ctx.drawImage(game22.sprite, rect.x, rect.y, rect.w, rect.h, -len / 2, -tileH / 2, len, tileH);
        } catch (e) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = '#16343f';
            ctx.lineWidth = 14;
            ctx.stroke();
        }
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(junction.x, junction.y);
        ctx.lineTo(rx, ry);
        ctx.strokeStyle = jrActive ? '#2b6b85' : '#444';
        ctx.lineWidth = 6;
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(junction.x, junction.y);
        ctx.lineTo(rx, ry);
        ctx.strokeStyle = '#16343f';
        ctx.lineWidth = 14;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(junction.x, junction.y);
        ctx.lineTo(rx, ry);
        ctx.strokeStyle = jrActive ? '#2b6b85' : '#444';
        ctx.lineWidth = 6;
        ctx.stroke();
    }

    ctx.restore();
}

function drawTap22(ctx, x, y, label, open) {
    ctx.save();

    // Corps du robinet
    ctx.fillStyle = open ? "#7fd3ff" : "#555b66";
    ctx.strokeStyle = "#cfd8e3";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Poignée
    ctx.strokeStyle = "#cfd8e3";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 25);
    ctx.lineTo(x + 20, y - 25);
    ctx.stroke();

    // Lettre
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px VT323";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 2);

    // État
    ctx.font = "14px VT323";
    ctx.fillStyle = open ? "#7fd3ff" : "#888";
    ctx.fillText(open ? "OUVERT" : "FERMÉ", x, y + 40);

    ctx.restore();
}

function drawFlowDirection22(ctx) {
    const dir = game22.flowDir;
    const cx = game22.canvas.width / 2;
    const cy = game22.canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy - 40);

    ctx.fillStyle = dir === 1 ? "#7fd3ff" : "#ff6b6b";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    // Flèche gauche-droite
    if (dir === 1) {
        // vers la droite
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(40, 0);
        ctx.lineTo(25, -10);
        ctx.moveTo(40, 0);
        ctx.lineTo(25, 10);
        ctx.stroke();
    } else {
        // vers la gauche
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.lineTo(-40, 0);
        ctx.lineTo(-25, -10);
        ctx.moveTo(-40, 0);
        ctx.lineTo(-25, 10);
        ctx.stroke();
    }

    ctx.font = "16px VT323";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
        dir === 1 ? "Flux : remplissage" : "Flux : vidange",
        0,
        12
    );

    ctx.restore();
}

function drawReservoir22(ctx) {
    const x = 320;
    const y = 260;
    const w = 160;
    const h = 110;

    ctx.save();

    // Contour
    ctx.strokeStyle = "#cfd8e3";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Niveau d'eau
    const level = game22.reservoir / 100;
    const waterHeight = h * level;

    ctx.fillStyle = "#1e90ffaa";
    const drawH = Math.max(0, waterHeight - 4);
    ctx.fillRect(x + 2, y + h - drawH + 2, w - 4, drawH);

    // Texte
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px VT323";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${game22.reservoir}%`, x + w / 2, y + h / 2);

    ctx.restore();
}

/* ---------- MESSAGES & VICTOIRE ---------- */

function setMsg22(text) {
    const el = document.getElementById("msg22");
    if (el) el.textContent = text;
}

function checkWin22() {
    if (game22.reservoir >= 60 && !game22.gameOver) {
        game22.gameOver = true;
        setMsg22("🎉 Tu as atteint 60% du réservoir et compris la contre-logique des robinets !");
        setTimeout(() => game22.onFinish && game22.onFinish(), 1500);
    }
}
