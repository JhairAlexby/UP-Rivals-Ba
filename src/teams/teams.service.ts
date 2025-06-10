import { Injectable, ConflictException, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { User } from 'src/auth/entities/user.entity';
import { TeamMember } from './entities/team-member.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, captain: User) {
    const existingTeam = await this.teamRepository.findOneBy({ name: createTeamDto.name });
    if (existingTeam) throw new ConflictException(`A team with the name "${createTeamDto.name}" already exists.`);
    const newTeam = this.teamRepository.create({ ...createTeamDto, captain });
    await this.teamRepository.save(newTeam);
    const { password, ...safeCaptain } = captain;
    return { ...newTeam, captain: safeCaptain };
  }

  // --- CORRECCIÓN DEFINITIVA ---
  async addMember(teamId: string, addMemberDto: AddMemberDto, captain: User) {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect('team.captain', 'captainUser')
      .where('team.id = :id', { id: teamId })
      .getOne();
      
    // Línea de depuración para ver qué se obtiene
    console.log('EQUIPO ENCONTRADO EN addMember:', JSON.stringify(team, null, 2));
    
    if (!team) throw new NotFoundException('Team not found');

    if (!team.captain) {
        throw new InternalServerErrorException('Captain relation not loaded for the team.');
    }
    
    if (team.captain.id !== captain.id) {
      throw new ForbiddenException('Only the team captain can add members.');
    }
    
    const memberToAdd = await this.userRepository.findOneBy({ id: addMemberDto.userId });
    if (!memberToAdd) throw new NotFoundException('User to add not found');

    const teamMember = this.teamMemberRepository.create({ teamId, userId: addMemberDto.userId });
    await this.teamMemberRepository.save(teamMember);
    
    return { message: 'Member added successfully.' };
  }
}
