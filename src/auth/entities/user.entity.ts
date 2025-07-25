import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer'; // <-- ¡IMPORTACIÓN AÑADIDA!
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TeamMember } from 'src/teams/entities/team-member.entity';

export enum UserRole {
  ORGANIZER = 'organizer',
  PLAYER = 'player',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column('text')
  name: string;

  @Exclude() 
  @Column('text')
  password: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true, name: 'profile_picture' })
  profilePicture?: string;

  @Column({ type: 'text', nullable: true })
  institution?: string;

  @Column({ type: 'text', nullable: true })
  career?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PLAYER })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', unique: true, nullable: true })
  qrCode?: string;

  @BeforeInsert()
  private generateQRCode() {
    // Generar código único para QR basado en timestamp + random
    this.qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  @OneToMany(() => Tournament, (tournament) => tournament.organizer)
  organizedTournaments: Tournament[];

  @OneToMany(() => Team, (team) => team.captain)
  captainOfTeams: Team[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teams: TeamMember[];
}
