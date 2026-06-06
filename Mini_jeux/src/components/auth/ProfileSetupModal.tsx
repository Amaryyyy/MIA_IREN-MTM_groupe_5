import { useState } from "react";
import { AVATAR_OPTIONS, DEFAULT_AVATAR_URL } from "@/constants/avatars";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseErrorMessage } from "@/lib/supabase/errors";

export default function ProfileSetupModal() {
  const { completeProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR_URL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await completeProfile(username, avatarUrl);
    } catch (err) {
      setError(getSupabaseErrorMessage(err, "Erreur de profil"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card profile-modal">
        <h2 className="modal-title">Crée ton profil</h2>
        <p className="modal-subtitle">
          Choisis un pseudo et un avatar pour sauvegarder ta progression.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Pseudo</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              minLength={3}
              maxLength={20}
              required
              placeholder="Explorateur42"
            />
          </label>

          <div className="avatar-picker">
            <span className="avatar-picker-label">Avatar</span>
            <div className="avatar-grid">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={
                    avatarUrl === avatar.url
                      ? "avatar-option selected"
                      : "avatar-option"
                  }
                  onClick={() => setAvatarUrl(avatar.url)}
                  title={avatar.label}
                >
                  <img src={avatar.url} alt={avatar.label} />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Enregistrement..." : "Valider mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
