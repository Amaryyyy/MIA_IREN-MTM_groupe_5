import { useCallback, useEffect, useState } from "react";
import BackgroundLayers from "@/components/BackgroundLayers";
import FloatingIcons from "@/components/FloatingIcons";
import HomeScreen from "@/components/HomeScreen";
import PlayArea from "@/components/PlayArea";
import SideDecorations from "@/components/SideDecorations";
import StarRainLayer from "@/components/StarRainLayer";
import { getAllLevels } from "@/lib/loadGame";
import type { AppScreen, StarBurst } from "@/types/game";

export default function App() {
  const levels = getAllLevels();
  const [screen, setScreen] = useState<AppScreen>("home");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [starBursts, setStarBursts] = useState<StarBurst[]>([]);

  const inGame = screen === "play";

  const startGameFlow = useCallback(() => {
    setCurrentLevel(0);
    setScreen("play");
  }, []);

  const nextLevel = useCallback(() => {
    setCurrentLevel((prev) => Math.min(prev + 1, levels.length));
  }, [levels.length]);

  const previousLevel = useCallback(() => {
    setCurrentLevel((prev) => Math.max(prev - 1, 0));
  }, []);

  const triggerStarRain = useCallback((originX: number, originY: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setStarBursts((prev) => [...prev, { id, originX, originY }]);
  }, []);

  const removeStarBurst = useCallback((id: string) => {
    setStarBursts((prev) => prev.filter((burst) => burst.id !== id));
  }, []);

  useEffect(() => {
    if (inGame) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      startGameFlow();
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inGame, startGameFlow]);

  useEffect(() => {
    document.body.classList.toggle("in-game", inGame);
    return () => document.body.classList.remove("in-game");
  }, [inGame]);

  return (
    <>
      <BackgroundLayers />
      <SideDecorations hidden={inGame} onImageClick={triggerStarRain} />
      {screen === "home" && <HomeScreen onStart={startGameFlow} />}
      {screen === "play" && (
        <PlayArea
          currentLevel={currentLevel}
          onNext={nextLevel}
          onPrevious={previousLevel}
        />
      )}
      <FloatingIcons />
      {starBursts.map((burst) => (
        <StarRainLayer
          key={burst.id}
          originX={burst.originX}
          originY={burst.originY}
          onComplete={() => removeStarBurst(burst.id)}
        />
      ))}
    </>
  );
}
