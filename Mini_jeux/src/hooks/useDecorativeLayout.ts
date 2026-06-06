import { useEffect, type RefObject } from "react";
import type { DecorativeImageLayout } from "@/types/decoration";

interface LayoutItem extends DecorativeImageLayout {
  element: HTMLElement;
}

export function useDecorativeLayout(
  containerRef: RefObject<HTMLElement | null>,
  layout: DecorativeImageLayout[]
) {
  useEffect(() => {
    const applyLayout = () => {
      const container = containerRef.current;
      if (!container) return;

      const items: LayoutItem[] = layout
        .map((entry) => ({
          ...entry,
          element: container.querySelector<HTMLElement>(`.${entry.className}`),
        }))
        .filter((entry): entry is LayoutItem => entry.element !== null);

      if (items.length === 0) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const rows = 7;
      const marginY = Math.max(42, Math.round(viewportHeight * 0.08));
      const usableHeight = Math.max(220, viewportHeight - marginY * 2);
      const rowGap = usableHeight / (rows - 1);
      const baseSize = Math.max(96, Math.min(182, Math.round(viewportWidth * 0.11)));
      const edgeInset = Math.max(16, Math.round(viewportWidth * 0.02));
      const innerOffset = Math.max(84, Math.round(viewportWidth * 0.12));
      const edgeNudge = Math.max(8, Math.round(viewportWidth * 0.01));

      const columnX: Record<number, number> = {
        1: edgeInset + edgeNudge,
        2: edgeInset + innerOffset,
        3: viewportWidth - (edgeInset + innerOffset),
        4: viewportWidth - (edgeInset + edgeNudge),
      };

      items.forEach((item, index) => {
        const safeRow = Math.max(0, Math.min(rows - 1, item.row));
        const safeCol = columnX[item.col] ? item.col : 1;
        const top = marginY + safeRow * rowGap;
        const size = Math.round(baseSize * item.scale);
        const rotation = item.rotate;

        item.element.style.width = `${size}px`;
        item.element.style.height = `${size}px`;
        item.element.style.top = `${top}px`;
        item.element.style.left = `${columnX[safeCol]}px`;
        item.element.style.right = "auto";
        item.element.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        item.element.style.transformOrigin = "50% 50%";
        item.element.style.zIndex = String(10 + index);
      });
    };

    applyLayout();
    window.addEventListener("resize", applyLayout);
    return () => window.removeEventListener("resize", applyLayout);
  }, [containerRef, layout]);
}
