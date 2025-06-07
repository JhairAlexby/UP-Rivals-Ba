import { Injectable } from '@nestjs/common';
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
      organizer, // Asocia el torneo con el usuario organizador
    });

    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }

  // Aquí irán los métodos findAll, findOne, update, remove...
}
