export class PlayerTeamsResponseDto {
  teamId: string;
  teamName: string;
  teamLogo?: string;
  tournament: {
    tournamentId: string;
    tournamentName: string;
  };
}