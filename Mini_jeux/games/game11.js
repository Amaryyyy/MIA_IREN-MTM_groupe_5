import { createGameTitle, setFeedback } from "../gameInterface.js";
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { gameManager } from "../gameCleanup.js";

export function startGame11(container, onFinish) {
  container.innerHTML = "";

  const app = document.createElement("div");
  app.style.fontFamily = "Arial, sans-serif";
  app.style.color = "#222";
  app.style.padding = "10px";
  app.style.background = "#d6c8a3";
  app.style.borderRadius = "12px";

  const title = createGameTitle("Shape Matcher 3D");
  title.style.color = "#222";
  title.style.textShadow = "1px 1px 3px rgba(0,0,0,0.2)";

  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.justifyContent = "space-between";
  info.style.marginBottom = "8px";

  const scoreEl = document.createElement("span" );
  scoreEl.textContent = "Réussi: 0/5";
  const timerEl = document.createElement("span");
  timerEl.textContent = "Temps: 00:00";

  info.appendChild(scoreEl);
  info.appendChild(timerEl);

  const main = document.createElement("div");
  main.style.display = "block";
  main.style.width = "100%";

  const svgWrapper = document.createElement("div");
  svgWrapper.style.display = "none";
  svgWrapper.style.border = "2px solid #a18564";
  svgWrapper.style.borderRadius = "10px";
  svgWrapper.style.background = "linear-gradient(120deg, #f5eedb, #f1e2b5)";
  svgWrapper.style.padding = "8px";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "620");
  svg.setAttribute("height", "360");
  svg.style.display = "block";
  svg.style.width = "100%";
  svg.style.height = "360px";
  svgWrapper.appendChild(svg);

  const threeWrapper = document.createElement("div");
  threeWrapper.style.border = "2px solid #a18564";
  threeWrapper.style.borderRadius = "10px";
  threeWrapper.style.background = "#eeedec";
  threeWrapper.style.height = "520px";
  threeWrapper.style.position = "relative";
  threeWrapper.style.width = "100%";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  threeWrapper.appendChild(canvas);

  main.appendChild(svgWrapper);
  main.appendChild(threeWrapper);

  const actions = document.createElement("div");
  actions.style.marginTop = "10px";
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Réinitialiser";
  resetBtn.style.padding = "6px 10px";

  const instructBtn = document.createElement("button");
  instructBtn.textContent = "Instructions";
  instructBtn.style.padding = "6px 10px";

  const feedback = document.createElement("div");
  feedback.style.marginTop = "8px";
  feedback.style.minHeight = "22px";
  feedback.style.fontWeight = "bold";

  actions.appendChild(resetBtn);
  actions.appendChild(instructBtn);

  app.appendChild(title);
  app.appendChild(info);
  app.appendChild(main);
  app.appendChild(actions);
  app.appendChild(feedback);
  container.appendChild(app);

  const shapes2D = [
    { id: "cercle", cotes: 0, couleur: "cyan", x: 120, y: 100 },
    { id: "triangle", cotes: 3, couleur: "orange", x: 320, y: 100 },
    { id: "carre", cotes: 4, couleur: "yellow", x: 520, y: 100 },
    { id: "pentagone", cotes: 5, couleur: "pink", x: 220, y: 260 },
    { id: "hexagone", cotes: 6, couleur: "lime", x: 420, y: 260 }
  ];

  const zones = [];

  // Convertir les coordonnées SVG (0-620, 0-360) vers l'espace 3D
  function svgToWorld(svgX, svgY) {
    const plateWidth = 520;
    const plateHeight = 320;
    const svgWidth = 620;
    const svgHeight = 360;
    
    // Centrer les coordonnées
    const worldX = ((svgX / svgWidth) * plateWidth) - plateWidth / 2;
    const worldZ = ((svgY / svgHeight) * plateHeight) - plateHeight / 2;
    
    return { x: worldX, z: worldZ };
  }

  function createPolygonPoints(cx, cy, r, sides) {
    const points = [];
    for (let i = 0; i < sides; i += 1) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      points.push(`${px},${py}`);
    }
    return points.join(" ");
  }

  function draw2D() {
    svg.innerHTML = "";
    zones.length = 0;
    // defs for gradients / inner-shadow
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    grad.setAttribute("id", "holeGrad");
    grad.setAttribute("cx", "50%");
    grad.setAttribute("cy", "40%");
    grad.setAttribute("r", "70%");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", "#ffffff"); stop1.setAttribute("stop-opacity", "0.04");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "65%"); stop2.setAttribute("stop-color", "#000000"); stop2.setAttribute("stop-opacity", "0.18");
    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "100%"); stop3.setAttribute("stop-color", "#000000"); stop3.setAttribute("stop-opacity", "0.7");
    grad.appendChild(stop1); grad.appendChild(stop2); grad.appendChild(stop3);
    defs.appendChild(grad);
    svg.appendChild(defs);
    shapes2D.forEach((s) => {
      const zone = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const back = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      back.setAttribute("x", s.x - 48);
      back.setAttribute("y", s.y - 48);
      back.setAttribute("width", 96);
      back.setAttribute("height", 96);
      back.setAttribute("rx", 16);
      back.setAttribute("fill", "rgba(255,255,255,0.12)");
      back.setAttribute("stroke", "#fff");
      back.setAttribute("stroke-width", "2");
      zone.appendChild(back);

      if (s.cotes === 0) {
        // Draw a real-looking hole with inner shadow and faint rim
        const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hole.setAttribute("cx", s.x);
        hole.setAttribute("cy", s.y + 6);
        hole.setAttribute("r", 36);
        hole.setAttribute("fill", "url(#holeGrad)");
        hole.setAttribute("stroke", "rgba(255,255,255,0.06)");
        hole.setAttribute("stroke-width", "2");
        zone.appendChild(hole);
        const rim = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        rim.setAttribute("cx", s.x);
        rim.setAttribute("cy", s.y - 6);
        rim.setAttribute("r", 24);
        rim.setAttribute("fill", "none");
        rim.setAttribute("stroke", s.couleur);
        rim.setAttribute("stroke-width", "3");
        rim.setAttribute("opacity", "0.9");
        zone.appendChild(rim);
      } else {
        // approximate hole shape by polygon rim and dark interior
        const shadow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shadow.setAttribute("points", createPolygonPoints(s.x, s.y + 6, 36, s.cotes));
        shadow.setAttribute("fill", "url(#holeGrad)");
        shadow.setAttribute("stroke", "rgba(255,255,255,0.06)");
        shadow.setAttribute("stroke-width", "2");
        zone.appendChild(shadow);

        const rim = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        rim.setAttribute("points", createPolygonPoints(s.x, s.y - 6, 26, s.cotes));
        rim.setAttribute("fill", "none");
        rim.setAttribute("stroke", s.couleur);
        rim.setAttribute("stroke-width", "3");
        rim.setAttribute("opacity", "0.95");
        zone.appendChild(rim);
      }

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", s.x);
      label.setAttribute("y", s.y + 70);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", "#333");
      label.setAttribute("font-size", "14");
      label.textContent = `${s.cotes} côtés`;
      zone.appendChild(label);

      svg.appendChild(zone);
      const worldPos = svgToWorld(s.x, s.y);
      zones.push({ ...s, worldPos });
    });
  }

  // Convert a SVG screen coordinate (zone.x, zone.y) to world position on a horizontal plane at `planeY`
  function screenToWorld(screenX, screenY, planeY = 20) {
    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((screenX - rect.left) / rect.width) * 2 - 1;
    const ny = -((screenY - rect.top) / rect.height) * 2 + 1;
    const vec = new THREE.Vector3(nx, ny, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = (planeY - camera.position.y) / dir.y;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
  }

  function animateIntoHole(obj, zone) {
    return new Promise((resolve) => {
      const screenX = zone.x;
      const screenY = zone.y;
      const target = screenToWorld(screenX, screenY, plate.position.y - 6);
      const mesh = obj.mesh;
      const start = mesh.position.clone();
      const startTime = performance.now();
      const duration = 520;

      // small scale/tilt for satisfying sink
      const startRotX = mesh.rotation.x;
      const startRotZ = mesh.rotation.z;

      function step(t) {
        const p = Math.min((t - startTime) / duration, 1);
        // ease out
        const ease = 1 - Math.pow(1 - p, 3);
        mesh.position.x = start.x + (target.x - start.x) * ease;
        mesh.position.z = start.z + (target.z - start.z) * ease;
        mesh.position.y = start.y + (target.y - start.y) * ease * 0.9;
        mesh.rotation.x = startRotX + (Math.PI * 0.06) * ease;
        mesh.rotation.z = startRotZ + (Math.PI * 0.08) * ease;

        if (p < 1) requestAnimationFrame(step);
        else {
          // sink slightly into the hole and dim
          mesh.position.y = 10;
          mesh.material.opacity = 0.95;
          if (mesh.material.transparent === false) mesh.material.transparent = true;
          mesh.material.opacity = 0.85;
          mesh.material.emissive = new THREE.Color(0x222222);
          mesh.userData.matched = true;
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, threeWrapper.clientWidth / threeWrapper.clientHeight, 1, 1000);
  camera.position.set(0, 280, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(threeWrapper.clientWidth, threeWrapper.clientHeight);

  window.addEventListener('resize', () => {
    const w = threeWrapper.clientWidth;
    const h = threeWrapper.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    try { createHoleMarkers(); } catch (e) { }
  });

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(80, 150, 120);
  scene.add(directional);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(520, 320), new THREE.MeshPhongMaterial({ color: 0xede3cf }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Plate (table) above the floor where holes will be placed
  const plateWidth = 520;
  const plateHeight = 320;
  const plateY = 80;
  const plateThickness = 6;
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(plateWidth, plateThickness, plateHeight),
    new THREE.MeshStandardMaterial({ color: 0xf1e6d0, metalness: 0.04, roughness: 0.35 })
  );
  plate.position.set(0, plateY - plateThickness / 2, 0);
  plate.receiveShadow = true;
  scene.add(plate);

  const geometryMap = {
    sphere: new THREE.SphereGeometry(30, 18, 16),
    pyramid3: new THREE.ConeGeometry(35, 70, 3),
    cube: new THREE.BoxGeometry(60, 60, 60),
    pyramid5: new THREE.ConeGeometry(35, 70, 5),
    prism6: new THREE.CylinderGeometry(30, 30, 70, 6)
  };

  const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 });

  const objects = [
    { id: 'sphere', cotes: 0, type: 'sphere', color: 0x00ffff, init: { x: -170, y: 100, z: 20 } },
    { id: 'pyramid3', cotes: 3, type: 'pyramid3', color: 0xffa500, init: { x: -80, y: 100, z: 80 } },
    { id: 'cube', cotes: 4, type: 'cube', color: 0xffdd57, init: { x: 0, y: 100, z: -20 } },
    { id: 'pyramid5', cotes: 5, type: 'pyramid5', color: 0xffc0cb, init: { x: 80, y: 100, z: 80 } },
    { id: 'prism6', cotes: 6, type: 'prism6', color: 0x00ff7f, init: { x: 170, y: 100, z: 20 } }
  ];

  objects.forEach((o) => {
    o.mesh = new THREE.Mesh(geometryMap[o.type], material(o.color));
    o.mesh.position.set(o.init.x, o.init.y, o.init.z);
    o.mesh.userData = { id: o.id, cotes: o.cotes, matched: false, init: o.init };
    scene.add(o.mesh);
  });

  // Hole markers on the plate (visual). Recomputed when SVG layout changes.
  let holeMarkers = [];

  function clearHoleMarkers() {
    holeMarkers.forEach(h => scene.remove(h));
    holeMarkers = [];
  }

  function createHoleMarkers() {
    clearHoleMarkers();
    zones.forEach((z) => {
      const worldX = z.worldPos.x;
      const worldZ = z.worldPos.z;
      const holeY = plate.position.y + 2;
      
      // Stocker la position 3D du trou
      z.worldPos = { x: worldX, y: holeY, z: worldZ };
      
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(26, 26, 8, Math.max(12, z.cotes * 3)),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.04 })
      );
      rim.rotation.x = -Math.PI / 2;
      rim.position.set(worldX, holeY, worldZ);
      rim.receiveShadow = true;
      scene.add(rim);
      holeMarkers.push(rim);
      
      // rim highlight
      const rimTop = new THREE.Mesh(
        new THREE.RingGeometry(18, 26, Math.max(8, z.cotes * 3)),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 })
      );
      rimTop.rotation.x = -Math.PI / 2;
      rimTop.position.set(worldX, holeY + 4.2, worldZ);
      scene.add(rimTop);
      holeMarkers.push(rimTop);
    });
  }
    });
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let activeObject = null;
  let dragging = false;

  function setScore(value) {
    scoreEl.textContent = `Réussi: ${value}/5`;
  }

  function setFeedbackText(text, success) {
    setFeedback(feedback, !!success, text);
  }

  let score = 0;
  function incrementScore() {
    score += 1;
    setScore(score);
  }

  function gameEndCheck() {
    if (score >= 5) {
      setFeedbackText('Bravo ! Toutes les formes sont correspondantes.', true);
      onFinish();
      stopTimer();
    }
  }

  function inDropZone(obj) {
    // Utiliser les positions 3D du monde au lieu de projections d'écran
    const objPos = obj.mesh.position;
    let best = null;
    let bestDist = Infinity;
    
    zones.forEach((z) => {
      if (!z.worldPos) return; // Vérifier que worldPos est défini
      // Calculer la distance 3D entre la forme et le centre du trou
      const dx = objPos.x - z.worldPos.x;
      const dy = objPos.y - z.worldPos.y;
      const dz = objPos.z - z.worldPos.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < bestDist) {
        bestDist = d;
        best = z;
      }
    });

    // Tolérance de 50 unités en espace 3D
    return bestDist < 50 ? best : null;
  }

  function resetGame() {
    score = 0;
    setScore(score);
    draw2D();
    // recreate hole markers now that SVG layout refreshed
    try { createHoleMarkers(); } catch (e) { /* ignore until created */ }
    objects.forEach((o) => {
      o.mesh.position.set(o.init.x, o.init.y, o.init.z);
      o.mesh.userData.matched = false;
      o.mesh.visible = true;
      o.mesh.material.emissive.setHex(0x000000);
      if (o.mesh.material) { o.mesh.material.opacity = 1; o.mesh.material.transparent = false; }
    });
    setFeedbackText('Jeu réinitialisé, c\'est reparti !', true);
    startTimer();
  }

  function currentTimer() {
    let sec = 0;
    timerEl.textContent = 'Temps: 00:00';
    return setInterval(() => {
      sec += 1;
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      timerEl.textContent = `Temps: ${m}:${s}`;
    }, 1000);
  }

  let timerId = currentTimer();
  function stopTimer() {
    clearInterval(timerId);
  }

  function startTimer() {
    stopTimer();
    timerId = currentTimer();
  }

  function onPointerDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      return;
    }
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(objects.map(o => o.mesh).filter(m => !m.userData.matched));
    if (hits.length > 0) {
      activeObject = hits[0].object;
      dragging = true;
      activeObject.material.emissive = new THREE.Color(0x555555);
      document.body.style.cursor = 'grabbing';
    }
  }

  function onPointerMove(event) {
    if (!dragging || !activeObject) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    // Intersection avec le plan de la plaque (hauteur Y = plateY)
    const plateY = plate.position.y;
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -plateY);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(ground, intersect);
    if (intersect) {
      activeObject.position.set(intersect.x, plateY + 12, intersect.z);
    }
  }

  async function onPointerUp() {
    if (!dragging || !activeObject) return;
    dragging = false;
    document.body.style.cursor = 'default';

    const obj = objects.find((o) => o.mesh === activeObject);
    const zone = inDropZone(obj);
    if (zone && obj.cotes === zone.cotes) {
      // play sink animation into hole then finalize
      try {
        await animateIntoHole(obj, zone);
      } catch (e) {
        // ignore animation errors
      }
      if (obj.mesh) obj.mesh.visible = false;
      incrementScore();
      setFeedbackText(`Match correct (${obj.id} => ${zone.id})`, true);
      draw2D();
      gameEndCheck();
    } else {
      obj.mesh.position.set(obj.init.x, obj.init.y, obj.init.z);
      setFeedbackText('Mauvaise cible, réessaye.', false);
      setTimeout(() => {
        if (obj.mesh) obj.mesh.material.emissive.setHex(0x000000);
      }, 300);
    }

    activeObject = null;
  }

  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  resetBtn.addEventListener('click', resetGame);

  instructBtn.addEventListener('click', () => {
    alert('Vue de dessus : place chaque forme 3D sur le trou correspondant (même nombre de côtés). Glisse-la vers le trou !');
  });

  function animate() {
    requestAnimationFrame(animate);
    objects.forEach((o) => {
      if (!o.mesh.userData.matched) {
        o.mesh.rotation.y += 0.005;
        o.mesh.rotation.x += 0.002;
      }
    });
    renderer.render(scene, camera);
  }

  draw2D();
  resetGame();
  animate();
}
