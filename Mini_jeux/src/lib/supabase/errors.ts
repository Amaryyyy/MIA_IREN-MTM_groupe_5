interface SupabaseLikeError {
  message?: string;
  code?: string;
  details?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  "23505": "Ce pseudo est déjà pris.",
  "42501": "Permission refusée. Vérifie les droits SQL (GRANT) dans Supabase.",
  PGRST301: "Accès refusé par les règles de sécurité (RLS).",
};

export function getSupabaseErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const err = error as SupabaseLikeError;
  if (err.code && ERROR_MESSAGES[err.code]) {
    return ERROR_MESSAGES[err.code];
  }

  if (typeof err.message === "string" && err.message.length > 0) {
    if (err.message.includes("row-level security")) {
      return "Accès refusé : exécute supabase/fix-grants.sql dans le SQL Editor Supabase.";
    }
    return err.message;
  }

  return fallback;
}
