export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  current_level_index: number;
  updated_at: string;
}

export interface ScoreRow {
  id: string;
  user_id: string;
  level_index: number;
  score: number;
  time_seconds: number;
  attempts: number;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_score: number;
}

export interface LevelStats {
  levelIndex: number;
  timeSeconds: number;
  attempts: number;
}

type Tables = {
  profiles: {
    Row: Profile;
    Insert: {
      id: string;
      username: string;
      avatar_url?: string | null;
      created_at?: string;
    };
    Update: {
      username?: string;
      avatar_url?: string | null;
    };
    Relationships: [];
  };
  user_progress: {
    Row: UserProgress;
    Insert: {
      user_id: string;
      current_level_index?: number;
      updated_at?: string;
    };
    Update: {
      current_level_index?: number;
      updated_at?: string;
    };
    Relationships: [];
  };
  scores: {
    Row: ScoreRow;
    Insert: {
      id?: string;
      user_id: string;
      level_index: number;
      score: number;
      time_seconds: number;
      attempts?: number;
      created_at?: string;
    };
    Update: Partial<ScoreRow>;
    Relationships: [];
  };
};

export interface Database {
  public: {
    Tables: Tables;
    Views: {
      leaderboard: {
        Row: LeaderboardEntry;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
