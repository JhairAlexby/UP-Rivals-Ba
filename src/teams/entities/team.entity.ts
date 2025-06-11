import { User } from 'src/auth/entities/user.entity';
import { TournamentInscription } from 'src/tournaments/entities/tournament-inscription.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { Match } from 'src/matches/entities/match.entity'; 

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  logo?: string;

  @ManyToOne(() => User, (user) => user.captainOfTeams, { eager: true })
  captain: User;
  
  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  members: TeamMember[];

  @OneToMany(() => TournamentInscription, (inscription) => inscription.team)
  inscriptions: TournamentInscription[];

  @OneToMany(() => Match, (match) => match.teamA)
  matchesAsTeamA: Match[];

  @OneToMany(() => Match, (match) => match.teamB)
  matchesAsTeamB: Match[];
}
