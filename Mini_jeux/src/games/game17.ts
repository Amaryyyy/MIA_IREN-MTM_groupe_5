// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

let game14 = {};

export function startGame16(container, onFinish) {
    container.innerHTML = `
        <div style="
            text-align:center;
            font-family: 'Segoe UI', sans-serif;
            color: #e0f7ff;
            background: radial-gradient(circle at top, #0a0f1f, #000);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 0 40px rgba(0, 200, 255, 0.25);
        ">
            <div style="
                font-size: 1.3em;
                margin-bottom: 12px;
                color: #6beaff;
                text-shadow: 0 0 8px #00eaff;
            ">
                Mouvements : <span id="moves14" style="color: #00ffc8;">0</span>
            </div>

            <canvas id="taquinCanvas" width="360" height="360" style="
                border: 3px solid rgba(0, 255, 255, 0.4);
                border-radius: 12px;
                box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
                cursor: pointer;
                background: rgba(255,255,255,0.03);
            "></canvas>

            <p id="msg14" style="
                margin-top: 18px;
                font-weight: bold;
                min-height: 24px;
                color: #7be8ff;
                text-shadow: 0 0 6px #00eaff;
            ">
                Réorganisez les nombres premiers !
            </p>
        </div>
    `;

    const canvas = container.querySelector("#taquinCanvas");
    const ctx = canvas.getContext("2d");

    game14 = {
        ctx, canvas,
        size: 4,
        tileSize: 90,
        grid: [],
        empty: { x: 3, y: 3 }, // Sera écrasé dynamiquement par initTaquin
        moves: 0,
        onFinish,
        status: "PLAYING",
        animating: false,
        animation: null
    };

    initTaquin();
    canvas.addEventListener("click", clickTaquin);
    renderTaquin();
}

/* ------------------ INIT (GARANTI SOLVABLE) ------------------ */

function initTaquin() {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, null];

    let grid;
    let emptyRowFromBottom;

    do {
        // On mélange le tableau complet contenant les nombres ET la case vide (null)
        grid = [...primes].sort(() => Math.random() - 0.5);

        // On calcule la position de la case vide depuis le bas (de 1 à 4)
        const emptyIndex = grid.indexOf(null);
        const emptyRowFromTop = Math.floor(emptyIndex / 4);
        emptyRowFromBottom = 4 - emptyRowFromTop;

    } while (!isSolvable(grid, emptyRowFromBottom));

    game14.grid = grid;

    // Mise à jour de la position de la case vide dans l'état global du jeu
    const finalEmptyIdx = grid.indexOf(null);
    game14.empty = {
        x: finalEmptyIdx % 4,
        y: Math.floor(finalEmptyIdx / 4)
    };
}

/* ------------------ CALCUL DE SOLVABILITÉ TAQUIN 4X4 ------------------ */

function isSolvable(arr, emptyRowFromBottom) {
    let inv = 0;
    // On ignore la case vide (null) pour compter uniquement les inversions de nombres
    const justNumbers = arr.filter(x => x !== null);

    for (let i = 0; i < justNumbers.length; i++) {
        for (let j = i + 1; j < justNumbers.length; j++) {
            if (justNumbers[i] > justNumbers[j]) inv++;
        }
    }

    // Règle mathématique pour un taquin à dimensions paires (4x4) :
    // - Si la ligne de la case vide (en partant du bas) est IMPAIRE, les inversions doivent être PAIRES.
    // - Si la ligne de la case vide (en partant du bas) est PAIRE, les inversions doivent être IMPAIRES.
    if (emptyRowFromBottom % 2 !== 0) {
        return inv % 2 === 0;
    } else {
        return inv % 2 !== 0;
    }
}

/* ------------------ CLICK ------------------ */

function clickTaquin(e) {
    if (game14.status !== "PLAYING") return;

    const rect = game14.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const x = Math.floor(mx / game14.tileSize);
    const y = Math.floor(my / game14.tileSize);

    moveTile(x, y);
}

/* ------------------ MOVE ------------------ */

function moveTile(x, y) {
    if (game14.animating) return;

    const ex = game14.empty.x;
    const ey = game14.empty.y;

    const isAdjacent =
        (x === ex && Math.abs(y - ey) === 1) ||
        (y === ey && Math.abs(x - ex) === 1);

    if (!isAdjacent) return;

    const idx1 = y * 4 + x;
    const movingValue = game14.grid[idx1];
    
    const startX = x * game14.tileSize;
    const startY = y * game14.tileSize;
    const endX = ex * game14.tileSize;
    const endY = ey * game14.tileSize;

    // On stocke les indices pour appliquer la permutation à la FIN de l'animation
    game14.animating = true;
    game14.animation = {
        value: movingValue,
        fromIdx: idx1,
        toIdx: ey * 4 + ex,
        fromX: startX,
        fromY: startY,
        toX: endX,
        toY: endY,
        nextEmpty: { x, y },
        start: performance.now(),
        duration: 120 // Animation légèrement adoucie pour le confort visuel
    };

    game14.moves++;
    document.getElementById("moves14").textContent = game14.moves;

    requestAnimationFrame(stepTaquinAnimation);
}

/* ------------------ CHECK WIN ------------------ */

function checkPrimeWin() {
    const primesOrdered = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

    for (let i = 0; i < 15; i++) {
        if (game14.grid[i] !== primesOrdered[i]) return;
    }

    if (game14.grid[15] !== null) return;

    game14.status = "WIN";
    document.getElementById("msg14").textContent =
        "✨ Interface réorganisée avec succès !";

    setTimeout(game14.onFinish, 1500);
}

/* ------------------ RENDER ------------------ */

function renderTaquin() {
    const ctx = game14.ctx;
    ctx.fillStyle = "#000a14";
    ctx.fillRect(0, 0, 360, 360);

    const anim = game14.animating && game14.animation ? game14.animation : null;

    for (let i = 0; i < 16; i++) {
        const val = game14.grid[i];
        
        // Si la case est vide (null), on ne dessine rien
        if (val === null) continue;

        // Si cette tuile est actuellement en train de bouger, on ignore son dessin statique
        if (anim && i === anim.fromIdx) continue;

        const x = (i % 4) * game14.tileSize;
        const y = Math.floor(i / 4) * game14.tileSize;

        drawTile(val, x, y, 1);
    }

    // On dessine la tuile en mouvement par-dessus les autres avec ses coordonnées fluides
    if (anim) {
        const cx = anim.currentX ?? anim.fromX;
        const cy = anim.currentY ?? anim.fromY;
        drawTile(anim.value, cx, cy, 1.04); // Effet de relief discret pendant le mouvement
    }
}

function stepTaquinAnimation(now) {
    const anim = game14.animation;
    if (!anim) {
        game14.animating = false;
        renderTaquin();
        return;
    }

    const t = Math.min(1, (now - anim.start) / anim.duration);
    const eased = 1 - Math.pow(1 - t, 3); // Transition Cubic-Out fluide
    
    anim.currentX = anim.fromX + (anim.toX - anim.fromX) * eased;
    anim.currentY = anim.fromY + (anim.toY - anim.fromY) * eased;

    renderTaquin();

    if (t < 1) {
        requestAnimationFrame(stepTaquinAnimation);
        return;
    }

    // L'animation est terminée : on applique physiquement la modification dans la grille
    [game14.grid[anim.fromIdx], game14.grid[anim.toIdx]] = [game14.grid[anim.toIdx], game14.grid[anim.fromIdx]];
    game14.empty = anim.nextEmpty;

    game14.animating = false;
    game14.animation = null;
    
    renderTaquin();
    checkPrimeWin();
}

function drawTile(val, x, y, scale = 1) {
    const ctx = game14.ctx;
    const pad = 6;
    const size = game14.tileSize - pad * 2;
    const cx = x + game14.tileSize / 2;
    const cy = y + game14.tileSize / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    ctx.fillStyle = "rgba(0, 255, 255, 0.13)";
    ctx.strokeStyle = "rgba(0, 255, 255, 0.48)";
    ctx.lineWidth = 2;

    roundRect(ctx, x + pad, y + pad, size, size, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e0ffff";
    ctx.font = "bold 28px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(val, cx, cy);

    ctx.restore();
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