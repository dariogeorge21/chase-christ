import { createClient } from "@supabase/supabase-js";
import { GameScore } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export async function saveGameScore(score: GameScore): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.from("game_scores").insert([score]).select();

  return { data, error };
}

export async function getLeaderboard(limit: number = 20): Promise<GameScore[]> {
  const { data, error } = await supabase
    .from("game_scores")
    .select("*")
    .order("final_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data || [];
}

export async function resetLeaderboard(): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase.from("game_scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  return { success: !error, error };
}

