import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  logo?: string;

  // --- Relación Clave con User (Capitán) ---
  // Muchos equipos pueden ser capitaneados por un usuario.
  @ManyToOne(() => User, (user) => user.captainOfTeams, { eager: true })
  captain: User;
}
