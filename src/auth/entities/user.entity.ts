import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Definición del Enum con los roles permitidos
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
  @Column({
    type: 'enum',
    enum: UserRole, 
    default: UserRole.PLAYER, 
  })
  role: UserRole;
}