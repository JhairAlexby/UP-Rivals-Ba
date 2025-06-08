import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/auth/entities/user.entity';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}


  async create(createTournamentDto: CreateTournamentDto, organizer: User) {
    const newTournament = this.tournamentRepository.create({
      ...createTournamentDto,
      organizer,
    });

    await this.tournamentRepository.save(newTournament);
    
    const { password, ...safeOrganizer } = newTournament.organizer;
    return { ...newTournament, organizer: safeOrganizer };
  }

  async findAll() {
    const tournaments = await this.tournamentRepository.find();
    
    return tournaments.map(tournament => {
      if (tournament.organizer) {
        const { password, ...safeOrganizer } = tournament.organizer;
        return { ...tournament, organizer: safeOrganizer };
      }
      return tournament;
    });
  }

  async findOne(id: string) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    if (tournament.organizer) {
      const { password, ...safeOrganizer } = tournament.organizer;
      return { ...tournament, organizer: safeOrganizer };
    }
    
    return tournament;
  }
  
  async findTournamentsByOrganizer(user: User) {
    const tournaments = await this.tournamentRepository.find({
      where: {
        organizer: {
          id: user.id,
        },
      },
    });

    return tournaments.map(tournament => {
        const { password, ...safeOrganizer } = tournament.organizer;
        return { ...tournament, organizer: safeOrganizer };
    });
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto, user: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    if (tournament.organizer.id !== user.id) {
      throw new ForbiddenException('You do not have permission to edit this tournament.');
    }

    const tournamentToUpdate = await this.tournamentRepository.preload({
      id,
      ...updateTournamentDto,
    });

    if (!tournamentToUpdate) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    const savedTournament = await this.tournamentRepository.save(tournamentToUpdate);
    
    const { password, ...safeOrganizer } = tournament.organizer;
    
    return { ...savedTournament, organizer: safeOrganizer };
  }

  async remove(id: string, user: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    if (tournament.organizer.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this tournament.');
    }

    await this.tournamentRepository.remove(tournament);
    return { message: `Tournament with ID "${id}" successfully removed.` };
  }
}
