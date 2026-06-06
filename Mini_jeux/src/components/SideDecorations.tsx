import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { DECORATIVE_IMAGES } from "@/constants/decorativeImages";
import { useDecorativeLayout } from "@/hooks/useDecorativeLayout";

interface SideDecorationsProps {
  hidden: boolean;
  onImageClick: (originX: number, originY: number) => void;
}

export default function SideDecorations({
  hidden,
  onImageClick,
}: SideDecorationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useDecorativeLayout(containerRef, DECORATIVE_IMAGES);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (hidden) return;

      const image = event.currentTarget;
      const bounds = image.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      image.classList.remove("side-image-burst");
      void image.offsetWidth;
      image.classList.add("side-image-burst");

      if (burstRef.current) {
        clearTimeout(burstRef.current);
      }
      burstRef.current = setTimeout(() => {
        image.classList.remove("side-image-burst");
      }, 380);

      onImageClick(centerX, centerY);
    },
    [hidden, onImageClick]
  );

  useEffect(
    () => () => {
      if (burstRef.current) {
        clearTimeout(burstRef.current);
      }
    },
    []
  );

  return (
    <div ref={containerRef} className="side-deco" aria-hidden={hidden}>
      {DECORATIVE_IMAGES.map((item) => (
        <div
          key={item.className}
          className={`side-image ${item.className}`}
          data-row={item.row}
          data-col={item.col}
          data-scale={item.scale}
          data-rotate={item.rotate}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
