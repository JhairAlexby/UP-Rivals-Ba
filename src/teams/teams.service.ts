import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto, captain: User) {
    // Verificamos si ya existe un equipo con ese nombre
    const existingTeam = await this.teamRepository.findOneBy({ name: createTeamDto.name });
    if (existingTeam) {
      throw new ConflictException(`A team with the name "${createTeamDto.name}" already exists.`);
    }

    const newTeam = this.teamRepository.create({
      ...createTeamDto,
      captain, // Asignamos el capitán
    });

    await this.teamRepository.save(newTeam);

    const { password, ...safeCaptain } = captain;
    return { ...newTeam, captain: safeCaptain };
  }
}
