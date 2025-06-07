import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text', { default: 'open' }) // 'open', 'in_progress', 'finished'
  status: string;

  @ManyToOne(() => User, (user) => user.organizedTournaments, { eager: true })
  organizer: User;
}
