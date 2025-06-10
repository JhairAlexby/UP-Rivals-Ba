import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Team } from './team.entity';

@Entity()
export class TeamMember {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  teamId: string;

  @ManyToOne(() => User, user => user.teams)
  user: User;

  @ManyToOne(() => Team, team => team.members)
  team: Team;
}
