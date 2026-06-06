export function startTransitionEnd(container, onFinish) {
    container.innerHTML = `
        <div style="
            text-align:center;
            padding:60px;
            font-family:'Orbitron', sans-serif;
            color:white;
            background:radial-gradient(circle at center, #000428, #004e92);
            border-radius:25px;
            box-shadow:0 0 60px #00eaffaa;
            animation: glowEnd 3s infinite alternate;
        ">
            <h1 style="
                font-size:3em;
                color:#00eaff;
                text-shadow:0 0 25px #00eaff, 0 0 50px #00eaff;
            ">
                🌌 FÉLICITATIONS !
            </h1>

            <p style="font-size:1.6em; margin-top:20px;">
                Tu as terminé <span style="color:#ffd34f;">TOUS</span> les jeux de Gameverse.
            </p>

            <p style="font-size:1.3em; margin-top:10px;">
                Tu fais désormais partie des <span style="color:#7bffea;">Explorateurs Ultimes</span>.
            </p>

            <div style="margin-top:40px; font-size:1.2em;">
                Merci d'avoir joué 💙
            </div>

            <style>
                @keyframes glowEnd {
                    from { box-shadow:0 0 40px #00eaff55; }
                    to   { box-shadow:0 0 80px #00eaffaa; }
                }
            </style>
        </div>
    `;
}