// @ts-nocheck
import { gameManager } from "@/lib/gameCleanup";


let game24 = {};




export function startGame39(container, onFinish) {
   container.innerHTML = `
       <div style="text-align:center; font-family:'VT323', monospace; color:white; background:transparent; padding:0; border-radius:15px;">
           <p style="margin:0 0 8px; font-size:0.95em;">
               Empile les boules de glace sur le cornet.<br>
               <span style="color:#ffdd99;">La boule dont le parfum commence le plus tôt dans l'alphabet doit être en bas…</span>
           </p>




           <canvas id="iceCanvas24" width="900" height="600"
               style="border:4px solid #ffdd99; border-radius:8px; box-shadow:0 0 25px #ffdd99aa; background:#1a0f08;">
           </canvas>




           <p id="msg24" style="margin-top:8px; min-height:24px; font-size:1.05em;">
               Choisis une boule et dépose-la sur le cornet.
           </p>
       </div>
   `;




    const canvas = container.querySelector("#iceCanvas24");
    const ctx = canvas.getContext("2d");
    const maxHeight = Math.min(window.innerHeight * 0.68, 600);
    const maxWidthFromHeight = Math.floor(maxHeight * 1.5);
    const canvasWidth = Math.max(540, Math.min(900, Math.floor(window.innerWidth * 0.92), maxWidthFromHeight));
    const canvasHeight = Math.floor(canvasWidth / 1.5);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;




   /* ---------- PARFUMS ---------- */
   const FLAVORS = [
       { name: "caramel", color: "#c68c53" },
       { name: "chocolat", color: "#5a3a1e" },
       { name: "citron", color: "#fff36b" },
       { name: "fraise", color: "#ff6b81" },
       { name: "menthe", color: "#7fffd4" },
       { name: "myrtille", color: "#6b5bff" },
       { name: "pistache", color: "#9be39b" },
       { name: "vanille", color: "#f3e5ab" },
       // parfum trompeur
       { name: "yaourt", color: "#ffffff" }
   ];




   const chosen = shuffle24([...FLAVORS]).slice(0, 6);
   const winningOrder = [...chosen].sort((a, b) => a.name.localeCompare(b.name));




   const cone = {
       x: canvasWidth * 0.5,
       y: canvasHeight * 0.75,
       w: canvasWidth * (150 / 900),
       h: canvasHeight * (190 / 600)
   };



   const scoopRadius = Math.min(canvasWidth, canvasHeight) * (45 / 600);
   const scoopBaseY = canvasHeight * (500 / 600);
   const scoopStartX = canvasWidth * (120 / 900);
   const scoopGapX = canvasWidth * (120 / 900);




   const scoops = chosen.map((f, i) => ({
       id: i,
       flavor: f.name,
       color: f.color,
       x: scoopStartX + i * scoopGapX,
       y: scoopBaseY,
       r: scoopRadius,
       homeX: scoopStartX + i * scoopGapX,
       homeY: scoopBaseY,
       placedIndex: null,
       melting: false,
       meltProgress: 0,
       dripY: null
   }));




   game24 = {
       ctx,
       canvas,
       onFinish,
       scoops,
       cone,
       winningOrder,
       placed: [],
       dragging: null,
       dragOffsetX: 0,
       dragOffsetY: 0,
       scoopStackStep: scoopRadius * (55 / 45),
       gameOver: false
   };




    gameManager.addEventListener(canvas, "mousedown", onMouseDown24);
    gameManager.addEventListener(canvas, "mousemove", onMouseMove24);
    gameManager.addEventListener(canvas, "mouseup", onMouseUp24);
    gameManager.addEventListener(canvas, "mouseleave", onMouseUp24);




    const frame = requestAnimationFrame(loop24);
    gameManager.addAnimationFrame(frame);
}




/* ---------- INPUT ---------- */




function onMouseDown24(e) {
   if (game24.gameOver) return;




   const rect = game24.canvas.getBoundingClientRect();
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;




   for (let i = game24.scoops.length - 1; i >= 0; i--) {
       const s = game24.scoops[i];
       if (!s.melting && dist24(x, y, s.x, s.y) < s.r) {
           game24.dragging = s;
           game24.dragOffsetX = x - s.x;
           game24.dragOffsetY = y - s.y;
           return;
       }
   }
}




function onMouseMove24(e) {
   if (!game24.dragging) return;




   const rect = game24.canvas.getBoundingClientRect();
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;




   game24.dragging.x = x - game24.dragOffsetX;
   game24.dragging.y = y - game24.dragOffsetY;
}




function onMouseUp24() {
   if (!game24.dragging) return;




   const s = game24.dragging;




   if (isOverCone24(s)) {
       placeScoop24(s);
   } else {
       s.x = s.homeX;
       s.y = s.homeY;
   }




   game24.dragging = null;
}




/* ---------- LOGIQUE ---------- */




function isOverCone24(s) {
   const c = game24.cone;
   return (
       s.x > c.x - game24.canvas.width * (60 / 900) &&
       s.x < c.x + game24.canvas.width * (60 / 900) &&
       s.y > c.y - game24.canvas.height * (220 / 600) &&
       s.y < c.y + game24.canvas.height * (20 / 600)
   );
}




function placeScoop24(s) {
   const index = game24.placed.length;




   s.x = game24.cone.x;
    s.y = game24.cone.y - index * game24.scoopStackStep;
   s.placedIndex = index;




   game24.placed.push(s);




   setMsg24(`Tu as ajouté : ${s.flavor}`);




   if (game24.placed.length === game24.scoops.length) {
       checkWin24();
   }
}




function checkWin24() {
   const correct = game24.placed.every((s, i) =>
       s.flavor === game24.winningOrder[i].name
   );




   if (correct) {
       setMsg24("🎉 Bravo ! Tu as trouvé l'ordre secret : l'ordre alphabétique (de bas en haut) !");
       game24.gameOver = true;
       gameManager.addTimeout(setTimeout(() => game24.onFinish && game24.onFinish(), 1500));
   } else {
       setMsg24("❌ Mauvais ordre… Les boules fondent !");
       triggerMelting24();
   }
}




function triggerMelting24() {
   for (const s of game24.scoops) {
       if (s.placedIndex != null) {
           s.melting = true;
           s.meltProgress = 0;
           s.dripY = s.y + s.r;
       }
   }
   game24.placed = [];
}




/* ---------- ANIMATION ---------- */




function loop24() {
   updateMelting24();
   render24();
    const frame = requestAnimationFrame(loop24);
    gameManager.addAnimationFrame(frame);
}




function updateMelting24() {
   for (const s of game24.scoops) {
       if (s.melting) {
           s.meltProgress += 0.02;
           if (s.meltProgress >= 1) {
               s.melting = false;
               s.placedIndex = null;
               s.x = s.homeX;
               s.y = s.homeY;
               s.dripY = null;
           } else if (s.dripY != null) {
               s.dripY += 3;
           }
       }
   }
}




/* ---------- RENDER ---------- */




function render24() {
   const ctx = game24.ctx;
   const canvas = game24.canvas;




   ctx.clearRect(0, 0, canvas.width, canvas.height);




   drawBackground24(ctx, canvas);
   drawCone24(ctx, game24.cone);




   const sorted = [...game24.scoops].sort((a, b) => {
       const ai = a.placedIndex != null ? a.placedIndex : 999;
       const bi = b.placedIndex != null ? b.placedIndex : 999;
       return ai - bi;
   });




   for (const s of sorted) {
       drawScoop24(ctx, s);
   }
}




/* ---------- DESSIN ---------- */




function drawBackground24(ctx, canvas) {
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, "#1a0f08");
   grad.addColorStop(1, "#3b2414");
   ctx.fillStyle = grad;
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}




function drawCone24(ctx, cone) {
   ctx.save();




   const grad = ctx.createLinearGradient(cone.x, cone.y, cone.x, cone.y + cone.h);
   grad.addColorStop(0, "#f2c27b");
   grad.addColorStop(1, "#c58a45");




   ctx.fillStyle = grad;
   ctx.strokeStyle = "#8b5a2b";
   ctx.lineWidth = 3;




   ctx.beginPath();
   ctx.moveTo(cone.x - cone.w / 2, cone.y);
   ctx.lineTo(cone.x + cone.w / 2, cone.y);
   ctx.lineTo(cone.x, cone.y + cone.h);
   ctx.closePath();
   ctx.fill();
   ctx.stroke();




   ctx.strokeStyle = "#b5833a";
   ctx.lineWidth = 1.2;




   for (let i = -cone.w; i <= cone.w; i += 12) {
       ctx.beginPath();
       ctx.moveTo(cone.x + i / 2, cone.y);
       ctx.lineTo(cone.x, cone.y + cone.h);
       ctx.stroke();
   }
   for (let i = cone.w; i >= -cone.w; i -= 12) {
       ctx.beginPath();
       ctx.moveTo(cone.x + i / 2, cone.y);
       ctx.lineTo(cone.x, cone.y + cone.h);
       ctx.stroke();
   }




   ctx.restore();
}




function drawScoop24(ctx, s) {
   ctx.save();




   let r = s.r;
   let y = s.y;
   let flatten = 0.25;




   if (s.melting) {
       const p = s.meltProgress;
       r *= (1 - p * 0.6);
       y += p * 30;
       flatten = 0.25 + p * 0.4;
   }




   const topY = y - r;
   const bottomY = y + r * flatten;




   ctx.shadowColor = s.color + "aa";
   ctx.shadowBlur = 18;




   const grad = ctx.createRadialGradient(s.x - 10, topY + 10, r * 0.2, s.x, y, r);
   grad.addColorStop(0, lighten24(s.color, 0.35));
   grad.addColorStop(0.5, s.color);
   grad.addColorStop(1, darken24(s.color, 0.25));




   ctx.fillStyle = grad;
   ctx.beginPath();




   const steps = 24;
   for (let i = 0; i <= steps; i++) {
       const angle = Math.PI * (i / steps);
       const wobble = Math.sin(i * 0.7) * 3;
       const px = s.x + Math.cos(angle) * (r + wobble);
       const py = y - Math.sin(angle) * (r + wobble * 0.5);
       if (i === 0) ctx.moveTo(px, py);
       else ctx.lineTo(px, py);
   }




   ctx.lineTo(s.x + r, bottomY);
   ctx.lineTo(s.x - r, bottomY);
   ctx.closePath();
   ctx.fill();




   ctx.shadowBlur = 0;




   ctx.fillStyle = "rgba(255,255,255,0.25)";
   ctx.beginPath();
   ctx.ellipse(s.x - r * 0.3, y - r * 0.4, r * 0.4, r * 0.25, -0.4, 0, Math.PI * 2);
   ctx.fill();




   ctx.fillStyle = darken24(s.color, 0.3);
   ctx.beginPath();
   ctx.ellipse(s.x, bottomY, r * 0.9, r * 0.25, 0, 0, Math.PI * 2);
   ctx.globalAlpha = 0.4;
   ctx.fill();
   ctx.globalAlpha = 1;




   if (s.melting && s.dripY != null) {
       ctx.fillStyle = s.color;
       ctx.beginPath();
       ctx.arc(s.x + 8, s.dripY, 6, 0, Math.PI * 2);
       ctx.fill();
   }




   ctx.restore();




   if (!s.melting) {
       ctx.fillStyle = "#ffffff";
       ctx.font = "16px VT323";
       ctx.textAlign = "center";
       ctx.fillText(s.flavor, s.x, s.y + s.r + 20);
   }

}



/* ---------- UTILS ---------- */




function dist24(x1, y1, x2, y2) {
   return Math.hypot(x1 - x2, y1 - y2);
}




function shuffle24(arr) {
   for (let i = arr.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
}




function lighten24(hex, amount) {
   const num = parseInt(hex.slice(1), 16);
   let r = (num >> 16) & 255;
   let g = (num >> 8) & 255;
   let b = num & 255;




   r = Math.min(255, Math.floor(r + 255 * amount));
   g = Math.min(255, Math.floor(g + 255 * amount));
   b = Math.min(255, Math.floor(b + 255 * amount));




   return `rgb(${r},${g},${b})`;
}




function darken24(hex, amount) {
   const num = parseInt(hex.slice(1), 16);
   let r = (num >> 16) & 255;
   let g = (num >> 8) & 255;
   let b = num & 255;




   r = Math.max(0, Math.floor(r - 255 * amount));
   g = Math.max(0, Math.floor(g - 255 * amount));
   b = Math.max(0, Math.floor(b - 255 * amount));




   return `rgb(${r},${g},${b})`;
}




function setMsg24(text) {
   const el = document.getElementById("msg24");
   if (el) el.textContent = text;
}