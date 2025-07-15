export class PlayerPendingMatchesResponseDto {
  matchId: string;
  date: Date;
  status: string;
  tournament: {
    id: string;
    name: string;
    category: string;
  };
  teamA: {
    id: string;
    name: string;
    logo?: string;
  };
  teamB: {
    id: string;
    name: string;
    logo?: string;
  };
  userTeam: {
    id: string;
    name: string;
    logo?: string;
    isTeamA: boolean; // Indica si el equipo del usuario es teamA o teamB
  };
}