import { useEffect, useRef } from "react";

interface StarRainLayerProps {
  originX: number;
  originY: number;
  onComplete: () => void;
}

export default function StarRainLayer({
  originX,
  originY,
  onComplete,
}: StarRainLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;

    const viewportWidth = window.innerWidth;
    const totalStars = 34;
    let remaining = totalStars;

    for (let i = 0; i < totalStars; i += 1) {
      const star = document.createElement("span");
      star.className = "star-rain-particle";

      const left = originX + (Math.random() - 0.5) * 360;
      const clampedLeft = Math.max(12, Math.min(viewportWidth - 12, left));
      const size = 7 + Math.random() * 10;
      const duration = 1050 + Math.random() * 1100;
      const delay = Math.random() * 200;
      const drift = (Math.random() - 0.5) * 140;
      const startOffsetY = -80 - Math.random() * (Math.max(originY, 60) * 0.2);

      star.style.left = `${clampedLeft}px`;
      star.style.top = `${startOffsetY}px`;
      star.style.setProperty("--star-size", `${size}px`);
      star.style.setProperty("--star-fall-duration", `${duration}ms`);
      star.style.setProperty("--star-fall-delay", `${delay}ms`);
      star.style.setProperty("--star-drift", `${drift}px`);

      star.addEventListener("animationend", () => {
        star.remove();
        remaining -= 1;
        if (remaining <= 0) {
          onComplete();
        }
      });

      layer.appendChild(star);
    }

    const fallback = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(fallback);
      layer.innerHTML = "";
    };
  }, [originX, originY, onComplete]);

  return <div ref={layerRef} className="star-rain-layer" />;
}
