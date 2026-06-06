import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    clearAuthError();
    setSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setLocalError(
          "Compte créé ! Vérifie ta boîte mail si la confirmation est activée, puis connecte-toi."
        );
        setMode("login");
      }
      onSuccess?.();
      if (mode === "login") onClose();
    } catch {
      // authError géré par le contexte
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = localError ?? authError;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card auth-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("login")}
          >
            Se connecter
          </button>
          <button
            type="button"
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("register")}
          >
            S&apos;inscrire
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? "Chargement..."
              : mode === "login"
                ? "Connexion"
                : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
