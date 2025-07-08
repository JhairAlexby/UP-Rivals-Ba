import { Injectable, ConflictException, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { User } from 'src/auth/entities/user.entity';
import { TeamMember } from './entities/team-member.entity';
import { AddMemberDto } from './dto/add-member.dto';
import { PlayerTeamsResponseDto } from './dto/player-teams-response.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, captain: User) {
    const existingTeam = await this.teamRepository.findOneBy({ name: createTeamDto.name });
    if (existingTeam) {
      throw new ConflictException(`Un equipo con el nombre "${createTeamDto.name}" ya existe.`);
    }

    const newTeam = this.teamRepository.create({ ...createTeamDto, captain });
    return this.teamRepository.save(newTeam);
  }

  async addMember(teamId: string, addMemberDto: AddMemberDto, captain: User) {
    const team = await this.teamRepository.findOne({ where: { id: teamId }, relations: { captain: true } });
    if (!team) throw new NotFoundException('Equipo no encontrado.');
    if (!team.captain) throw new InternalServerErrorException('No se pudo verificar el capitán del equipo.');
    if (team.captain.id !== captain.id) {
      throw new ForbiddenException('Solo el capitán del equipo puede añadir miembros.');
    }
    const memberToAdd = await this.userRepository.findOneBy({ id: addMemberDto.userId });
    if (!memberToAdd) throw new NotFoundException('Usuario a añadir no encontrado.');
    const teamMember = this.teamMemberRepository.create({ teamId, userId: addMemberDto.userId });
    await this.teamMemberRepository.save(teamMember);
    return { message: 'Miembro añadido exitosamente.' };
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto, user: User) {
    const team = await this.teamRepository.findOne({ where: { id: teamId }, relations: { captain: true } });

    if (!team) {
      throw new NotFoundException(`Equipo con ID "${teamId}" no encontrado.`);
    }

    // Verificación de propiedad: solo el capitán puede editar.
    if (team.captain.id !== user.id) {
      throw new ForbiddenException('No tienes permiso para editar este equipo.');
    }

    // Combina los datos del equipo con los nuevos datos del DTO y guarda.
    Object.assign(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async findTeamsByPlayer(user: User): Promise<PlayerTeamsResponseDto[]> {
    // Obtener todos los equipos donde el usuario es capitán
    const userTeams = await this.teamRepository.find({
      where: { captain: { id: user.id } },
      relations: ['inscriptions', 'inscriptions.tournament']
    });

    // Mapear los equipos con información del torneo
    const teamsWithTournaments: PlayerTeamsResponseDto[] = [];

    userTeams.forEach(team => {
      team.inscriptions.forEach(inscription => {
        teamsWithTournaments.push({
          teamId: team.id,
          teamName: team.name,
          teamLogo: team.logo,
          tournament: {
            tournamentId: inscription.tournament.id,
            tournamentName: inscription.tournament.name
          }
        });
      });
    });

    return teamsWithTournaments;
  }
}
