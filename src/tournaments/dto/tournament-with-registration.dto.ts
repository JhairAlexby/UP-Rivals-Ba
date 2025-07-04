import { Tournament } from '../entities/tournament.entity';

export class TournamentWithRegistrationDto extends Tournament {
  isRegistered: boolean;
}