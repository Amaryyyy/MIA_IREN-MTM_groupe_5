import { useEffect, useRef, useState } from "react";
import { gameManager } from "@/lib/gameCleanup";
import { getAllLevels, loadGame } from "@/lib/loadGame";

interface PlayAreaProps {
  currentLevel: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PlayArea({
  currentLevel,
  onNext,
  onPrevious,
}: PlayAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelTitle, setLevelTitle] = useState("GAMEVERSE");
  const [finished, setFinished] = useState(false);
  const levels = getAllLevels();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;

    const run = async () => {
      if (currentLevel >= levels.length) {
        setLevelTitle("Bravo !");
        setFinished(true);
        container.innerHTML = "<h3>Tous les jeux sont terminés</h3>";
        return;
      }

      setFinished(false);

      const result = await loadGame(container, currentLevel, () => {
        if (!cancelled) {
          onNext();
        }
      });

      if (!cancelled) {
        setLevelTitle(result.title);
        setFinished(result.finished);
      }
    };

    void run();

    return () => {
      cancelled = true;
      gameManager.cleanup();
    };
  }, [currentLevel, levels.length, onNext]);

  const showPrevious = currentLevel > 0;
  const showNext = !finished && currentLevel < levels.length - 1;

  return (
    <section className="play-area">
      <h2 className="level-title">{levelTitle}</h2>
      <div ref={containerRef} id="gameContainer" className="game-container" />
      <div className="nav-controls">
        {showPrevious && (
          <button type="button" onClick={onPrevious}>
            Precedent
          </button>
        )}
        {showNext && (
          <button type="button" onClick={onNext}>
            Passer
          </button>
        )}
      </div>
    </section>
  );
}
