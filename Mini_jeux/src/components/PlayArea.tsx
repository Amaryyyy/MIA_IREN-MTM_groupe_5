import { useEffect, useRef, useState } from "react";
import { gameManager } from "@/lib/gameCleanup";
import { getAllLevels, loadGame } from "@/lib/loadGame";
import type { LevelStats } from "@/types/database";

interface PlayAreaProps {
  currentLevel: number;
  onNext: () => void;
  onPrevious: () => void;
  onLevelComplete?: (stats: LevelStats) => Promise<number | null>;
}

export default function PlayArea({
  currentLevel,
  onNext,
  onPrevious,
  onLevelComplete,
}: PlayAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const levelStartedAtRef = useRef(Date.now());
  const attemptsRef = useRef(1);
  const [levelTitle, setLevelTitle] = useState("GAMEVERSE");
  const [finished, setFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const levels = getAllLevels();

  useEffect(() => {
    levelStartedAtRef.current = Date.now();
    attemptsRef.current = 1;
    setLastScore(null);
  }, [currentLevel]);

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
        if (cancelled) return;

        void (async () => {
          const timeSeconds = Math.max(
            1,
            Math.floor((Date.now() - levelStartedAtRef.current) / 1000)
          );

          if (onLevelComplete) {
            const score = await onLevelComplete({
              levelIndex: currentLevel,
              timeSeconds,
              attempts: attemptsRef.current,
            });
            if (score != null) {
              setLastScore(score);
            }
          }

          if (!cancelled) {
            onNext();
          }
        })();
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
  }, [currentLevel, levels.length, onLevelComplete, onNext]);

  const handleSkip = () => {
    attemptsRef.current += 1;
    onNext();
  };

  const showPrevious = currentLevel > 0;
  const showNext = !finished && currentLevel < levels.length - 1;

  return (
    <section className="play-area">
      <h2 className="level-title">{levelTitle}</h2>
      {lastScore != null && (
        <p className="score-toast">+{lastScore} points enregistrés !</p>
      )}
      <div ref={containerRef} id="gameContainer" className="game-container" />
    </section>
  );
}
