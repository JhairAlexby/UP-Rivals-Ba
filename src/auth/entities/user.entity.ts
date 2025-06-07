import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}