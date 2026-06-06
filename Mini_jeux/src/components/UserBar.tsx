import { useAuth } from "@/contexts/AuthContext";
import { getAllLevels } from "@/lib/level";

interface UserBarProps {
  onLoginClick: () => void;
  onLeaderboardClick: () => void;
}

export default function UserBar({ onLoginClick, onLeaderboardClick }: UserBarProps) {
  const { configured, loading, user, profile, progressLevel, signOut } = useAuth();
  const totalLevels = getAllLevels().length;

  if (!configured) {
    return (
      <div className="user-bar">
        <span className="user-bar-hint">
          Supabase non configuré — mode invité uniquement
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-bar">
        <span className="user-bar-hint">Chargement du compte...</span>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="user-bar">
        <div className="user-info">
          <img
            className="user-avatar"
            src={profile.avatar_url ?? "/assets/images/dog.png"}
            alt=""
          />
          <div className="user-meta">
            <span className="user-name">{profile.username}</span>
            <span className="user-progress">
              Niveau {Math.min(progressLevel + 1, totalLevels)} / {totalLevels}
            </span>
          </div>
        </div>
        <div className="user-actions">
          <button type="button" className="user-action-btn" onClick={onLeaderboardClick}>
            Leaderboard
          </button>
          <button type="button" className="user-action-btn" onClick={() => void signOut()}>
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-bar">
      <span className="user-bar-hint">
        Connecte-toi pour sauvegarder ta progression et entrer au classement
      </span>
      <div className="user-actions">
        <button type="button" className="user-action-btn" onClick={onLeaderboardClick}>
          Leaderboard
        </button>
        <button type="button" className="user-action-btn primary" onClick={onLoginClick}>
          Connexion
        </button>
      </div>
    </div>
  );
}
