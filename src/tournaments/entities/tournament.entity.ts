import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentInscription } from './tournament-inscription.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  category: string;

  @Column('text')
  modality: string;

  @Column('int')
  maxTeams: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column('text', { nullable: true })
  rules?: string;

  @Column('text', { default: 'open' })
  status: string;

  @ManyToOne(() => User, (user) => user.organizedTournaments, { eager: true })
  organizer: User;
  
  @OneToMany(() => TournamentInscription, (inscription) => inscription.tournament)
  inscriptions: TournamentInscription[];
}
