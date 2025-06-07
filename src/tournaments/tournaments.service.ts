import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/auth/entities/user.entity';

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
}
