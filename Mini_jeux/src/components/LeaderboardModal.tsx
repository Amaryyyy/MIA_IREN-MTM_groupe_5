import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/supabase/scores";
import type { LeaderboardEntry } from "@/types/database";

interface LeaderboardModalProps {
  onClose: () => void;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLeaderboard(10);
        setEntries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Impossible de charger le classement"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card leaderboard-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Leaderboard</h2>
        <p className="modal-subtitle">Top 10 — score total (meilleur score par niveau)</p>

        {loading && <p className="leaderboard-status">Chargement...</p>}
        {error && <p className="auth-error">{error}</p>}

        {!loading && !error && (
          <ol className="leaderboard-list">
            {entries.length === 0 && (
              <li className="leaderboard-empty">Aucun score pour le moment.</li>
            )}
            {entries.map((entry, index) => (
              <li key={entry.user_id} className="leaderboard-item">
                <span className="leaderboard-rank">#{index + 1}</span>
                <img
                  className="leaderboard-avatar"
                  src={entry.avatar_url ?? "/assets/images/dog.png"}
                  alt=""
                />
                <span className="leaderboard-name">{entry.username}</span>
                <span className="leaderboard-score">{entry.total_score} pts</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
