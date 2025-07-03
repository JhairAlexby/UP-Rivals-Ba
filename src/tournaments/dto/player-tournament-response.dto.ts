export class PlayerTournamentResponseDto {
  id: string;
  name: string;
  category: string;
  modality: string;
  rules?: string;
  startDate: Date;
  endDate: Date;
  maxTeams: number;
  status: string;
  inscriptionStatus: string; // 'pending', 'approved', 'rejected'
  teamName: string;
  teamId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
}