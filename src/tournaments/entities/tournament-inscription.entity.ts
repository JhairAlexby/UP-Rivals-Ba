import { Entity, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Tournament } from './tournament.entity';

@Entity()
export class TournamentInscription {
  @PrimaryColumn()
  teamId: string;

  @PrimaryColumn()
  tournamentId: string;

  @Column({ default: 'pending' }) // 'pending', 'approved', 'rejected'
  status: string;

  @ManyToOne(() => Team, team => team.inscriptions)
  team: Team;

  @ManyToOne(() => Tournament, tournament => tournament.inscriptions)
  tournament: Tournament;
}
