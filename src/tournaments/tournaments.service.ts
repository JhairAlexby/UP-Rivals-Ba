import { Injectable, NotFoundException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/auth/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TournamentInscription } from './entities/tournament-inscription.entity';
import { Match } from 'src/matches/entities/match.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { UpdateInscriptionStatusDto } from './dto/update-inscription.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TournamentInscription) private readonly inscriptionRepository: Repository<TournamentInscription>,
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto, organizer: User) {
    const newTournament = this.tournamentRepository.create({ ...createTournamentDto, organizer });
    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }
  async findAll() {
    return this.tournamentRepository.find();
  }
  async findOne(id: string) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    return tournament;
  }
  async findTournamentsByOrganizer(user: User) {
    return this.tournamentRepository.find({ where: { organizer: { id: user.id } } });
  }
  async update(id: string, updateTournamentDto: UpdateTournamentDto, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to edit this tournament.');
    const tournamentToUpdate = await this.tournamentRepository.preload({ id, ...updateTournamentDto });
    if (!tournamentToUpdate) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    return this.tournamentRepository.save(tournamentToUpdate);
  }
  async remove(id: string, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to delete this tournament.');
    await this.tournamentRepository.remove(tournament);
    return { message: `Tournament with ID "${id}" successfully removed.` };
  }
  async inscribeTeam(tournamentId: string, teamId: string, captain: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id: tournamentId });
    if (!tournament) throw new NotFoundException('Tournament not found.');
    const team = await this.teamRepository.findOne({ where: { id: teamId }, relations: { captain: true } });
    if (!team) throw new NotFoundException('Team not found.');
    if (!team.captain) throw new InternalServerErrorException('Could not verify team captain.');
    if (team.captain.id !== captain.id) throw new ForbiddenException('Only the team captain can inscribe the team.');
    const inscription = this.inscriptionRepository.create({ tournamentId, teamId });
    await this.inscriptionRepository.save(inscription);
    return { message: 'Team successfully inscribed, pending approval.' };
  }
  async getInscriptions(tournamentId: string, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException('Tournament not found.');
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to view these inscriptions.');
    return this.inscriptionRepository.find({
      where: { tournamentId },
      relations: { team: true },
    });
  }
  async updateInscriptionStatus(tournamentId: string, teamId: string, updateDto: UpdateInscriptionStatusDto, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException('Tournament not found.');
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to manage this inscription.');
    const inscription = await this.inscriptionRepository.findOneBy({ tournamentId, teamId });
    if (!inscription) throw new NotFoundException('Inscription not found.');
    inscription.status = updateDto.status;
    return this.inscriptionRepository.save(inscription);
  }

  // --- Método de Generación Automática de Calendario ---
  async generateSchedule(tournamentId: string, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException('Tournament not found.');
    if (tournament.organizer.id !== user.id) {
      throw new ForbiddenException('You do not have permission to generate the schedule for this tournament.');
    }
    
    const approvedInscriptions = await this.inscriptionRepository.find({
      where: { tournamentId, status: 'approved' },
      relations: { team: true },
    });

    if (approvedInscriptions.length < 2) {
        throw new ConflictException('At least two approved teams are required to generate a schedule.');
    }

    const teams = approvedInscriptions.map(inscription => inscription.team);

    // --- CORRECCIÓN AQUÍ ---
    // Especificamos explícitamente el tipo del array para incluir null.
    const shuffledTeams: (Team | null)[] = [...teams].sort(() => Math.random() - 0.5);
    const matchesToCreate: Match[] = [];
    const scheduleDate = new Date();

    if (shuffledTeams.length % 2 !== 0) {
      shuffledTeams.push(null);
    }

    const numTeams = shuffledTeams.length;
    const numRounds = numTeams - 1;

    for (let round = 0; round < numRounds; round++) {
      for (let i = 0; i < numTeams / 2; i++) {
        const teamA = shuffledTeams[i];
        const teamB = shuffledTeams[numTeams - 1 - i];

        if (teamA && teamB) {
          const matchDate = new Date(scheduleDate);
          matchDate.setDate(scheduleDate.getDate() + round);

          const match = this.matchRepository.create({
            tournament,
            teamA,
            teamB,
            date: matchDate,
          });
          matchesToCreate.push(match);
        }
      }
      const lastTeam = shuffledTeams.pop();
      // Añadimos una comprobación para asegurar a TypeScript que 'lastTeam' no es undefined.
      if (lastTeam !== undefined) {
        shuffledTeams.splice(1, 0, lastTeam);
      }
    }
    
    await this.matchRepository.save(matchesToCreate);

    return { message: `${matchesToCreate.length} matches have been generated successfully.` };
  }
}
