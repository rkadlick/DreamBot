import { supabase } from '../supabase/index';
import { PlayerGameStatsWithDetails } from '../types/index';
import { PlayerGameStats } from '../types/index';
import { NBA_TEAMS } from '../data/teams';

export async function getAllStats(): Promise<any> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  const { data: statsData, error: statsError } = await supabase
        .from("player_game_stats")
        .select("*")
        .order("game_date", { ascending: false });

      if (statsError) {
        console.error("Error loading game stats:", statsError);
      } else {
        const statsWithDetails: PlayerGameStatsWithDetails[] = (
          statsData || []
        ).map((stat: PlayerGameStats) => ({
          ...stat,
          opponent_team: NBA_TEAMS[stat.opponent_team_id as keyof typeof NBA_TEAMS],
        }));
        return statsWithDetails;
      }
}