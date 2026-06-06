export function startTransitionHard(container, onFinish) {
    container.innerHTML = `
        <div style="
            text-align:center;
            padding:40px;
            font-family:'Orbitron', sans-serif;
            color:white;
            background:radial-gradient(circle at center, #1a001f, #000);
            border-radius:20px;
            box-shadow:0 0 40px #ff3860aa;
        ">
            <h1 style="font-size:2.5em; color:#ff3860; text-shadow:0 0 15px #ff3860;">
                🔥 Niveau Supérieur !
            </h1>

            <p style="font-size:1.4em; margin-top:20px;">
                Tu as terminé les jeux <span style="color:#ffd34f;">moyens</span>.
            </p>

            <p style="font-size:1.2em; margin-top:10px;">
                Maintenant… place aux <span style="color:#ff3860;">vrais défis</span>.
            </p>

            <button id="nextHard" style="
                margin-top:30px;
                padding:12px 28px;
                font-size:1.2em;
                border:none;
                border-radius:10px;
                background:#ff3860;
                color:#fff;
                cursor:pointer;
                box-shadow:0 0 15px #ff3860aa;
            ">
                Affronter les défis
            </button>
        </div>
    `;

    document.getElementById("nextHard").addEventListener("click", () => {
        onFinish && onFinish();
    });
}
