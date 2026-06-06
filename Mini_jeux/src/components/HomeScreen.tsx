interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <main className="home-screen">
      <header className="hero">
        <h1 className="game-logo">GAMEVERSE</h1>
        <p className="tagline">Play Hard. Think Fast.</p>
      </header>

      <section className="mission-card">
        <p className="mission-title">THINK OUT OF THE BOX</p>
        <p className="mission-text">Oublie les regles usuelles. Chaque jeu te surprendra.</p>
      </section>

      <button type="button" className="start-btn" onClick={onStart}>
        PLAY
      </button>
    </main>
  );
}
