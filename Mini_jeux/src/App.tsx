import { useCallback, useEffect, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import ProfileSetupModal from "@/components/auth/ProfileSetupModal";
import BackgroundLayers from "@/components/BackgroundLayers";
import FloatingIcons from "@/components/FloatingIcons";
import HomeScreen from "@/components/HomeScreen";
import LeaderboardModal from "@/components/LeaderboardModal";
import PlayArea from "@/components/PlayArea";
import SideDecorations from "@/components/SideDecorations";
import StarRainLayer from "@/components/StarRainLayer";
import { useAuth } from "@/contexts/AuthContext";
import { getAllLevels } from "@/lib/loadGame";
import type { AppScreen, StarBurst } from "@/types/game";

export default function App() {
  const levels = getAllLevels();
  const {
    user,
    profile,
    progressLevel,
    needsProfileSetup,
    recordLevelCompletion,
  } = useAuth();

  const [screen, setScreen] = useState<AppScreen>("home");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [starBursts, setStarBursts] = useState<StarBurst[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const inGame = screen === "play";
  const canSave = Boolean(user && profile);
  const resumeLevel = canSave ? progressLevel : null;

  const startGameFlow = useCallback(() => {
    setCurrentLevel(canSave ? progressLevel : 0);
    setScreen("play");
  }, [canSave, progressLevel]);

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

      {screen === "home" && (
        <HomeScreen
          onStart={startGameFlow}
          onLoginClick={() => setShowAuthModal(true)}
          onLeaderboardClick={() => setShowLeaderboard(true)}
          resumeLevel={resumeLevel}
        />
      )}

      {screen === "play" && (
        <PlayArea
          currentLevel={currentLevel}
          onNext={nextLevel}
          onPrevious={previousLevel}
          onLevelComplete={canSave ? recordLevelCompletion : undefined}
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

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {needsProfileSetup && <ProfileSetupModal />}

      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </>
  );
}
