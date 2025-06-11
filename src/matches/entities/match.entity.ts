import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, tournament => tournament.matches)
  tournament: Tournament;

  @ManyToOne(() => Team, team => team.matchesAsTeamA)
  teamA: Team;

  @ManyToOne(() => Team, team => team.matchesAsTeamB)
  teamB: Team;

  @Column('int', { nullable: true })
  teamAScore?: number;

  @Column('int', { nullable: true })
  teamBScore?: number;

  @Column('timestamp')
  date: Date;

  @Column('text', { default: 'scheduled' }) // 'scheduled', 'finished'
  status: string;
}
