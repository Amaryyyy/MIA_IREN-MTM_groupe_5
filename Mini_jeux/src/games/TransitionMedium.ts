// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";

export function startTransitionMedium(container, onFinish) {
    container.innerHTML = `
        <div style="
            text-align:center;
            padding:40px;
            font-family:'Orbitron', sans-serif;
            color:white;
            background:radial-gradient(circle at center, #0a0f1f, #000);
            border-radius:20px;
            box-shadow:0 0 40px #00eaffaa;
        ">
            <h1 style="font-size:2.5em; color:#00eaff; text-shadow:0 0 15px #00eaff;">
                🚀 Bravo Explorateur !
            </h1>

            <p style="font-size:1.4em; margin-top:20px;">
                Tu viens de terminer les jeux <span style="color:#7bffea;">faciles</span>.
            </p>

            <p style="font-size:1.2em; margin-top:10px;">
                Prépare-toi… les défis deviennent maintenant <span style="color:#ffd34f;">plus corsés</span>.
            </p>

            <button id="nextMedium" style="
                margin-top:30px;
                padding:12px 28px;
                font-size:1.2em;
                border:none;
                border-radius:10px;
                background:#00eaff;
                color:#000;
                cursor:pointer;
                box-shadow:0 0 15px #00eaffaa;
            ">
                Continuer
            </button>
        </div>
    `;

    document.getElementById("nextMedium").addEventListener("click", () => {
        onFinish && onFinish();
    });
}