export class PendingInscriptionResponseDto {
  inscriptionId: string;
  status: string;
  team: {
    id: string;
    name: string;
    logo?: string;
    captain: {
      id: string;
      email: string;
      name: string;
    };
  };
  tournament: {
    id: string;
    name: string;
    category: string;
    startDate: Date;
    endDate: Date;
  };
}