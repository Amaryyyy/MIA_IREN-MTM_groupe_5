import UserBar from "@/components/UserBar";

interface HomeScreenProps {
  onStart: () => void;
  onLoginClick: () => void;
  onLeaderboardClick: () => void;
  resumeLevel?: number | null;
}

export default function HomeScreen({
  onStart,
  onLoginClick,
  onLeaderboardClick,
  resumeLevel,
}: HomeScreenProps) {
  return (
    <main className="home-screen">
      <UserBar
        onLoginClick={onLoginClick}
        onLeaderboardClick={onLeaderboardClick}
      />

      <header className="hero">
        <h1 className="game-logo">GAMEVERSE</h1>
        <p className="tagline">Play Hard. Think Fast.</p>
      </header>

      <section className="mission-card">
        <p className="mission-title">THINK OUT OF THE BOX</p>
        <p className="mission-text">
          Oublie les regles usuelles. Chaque jeu te surprendra.
        </p>
        {resumeLevel != null && resumeLevel > 0 && (
          <p className="resume-hint">
            Reprise au niveau {resumeLevel + 1} grâce à ta sauvegarde cloud.
          </p>
        )}
      </section>

      <button type="button" className="start-btn" onClick={onStart}>
        {resumeLevel != null && resumeLevel > 0 ? "CONTINUER" : "PLAY"}
      </button>
    </main>
  );
}
