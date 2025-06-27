import { Team } from "src/teams/entities/team.entity";

export class StandingsEntryDto {
  team: Team;
  played: number; // Partidos Jugados (PJ)
  wins: number;   // Victorias (PG)
  draws: number;  // Empates (PE)
  losses: number; // Derrotas (PP)
  goalsFor: number; // Goles a Favor (GF)
  goalsAgainst: number; // Goles en Contra (GC)
  goalDifference: number; // Diferencia de Goles (DG)
  points: number; // Puntos (Pts)
}
