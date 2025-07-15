export class OrganizerPendingMatchesResponseDto {
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
}