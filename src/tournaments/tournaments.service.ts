import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/auth/entities/user.entity';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Team } from 'src/teams/entities/team.entity';
import { TournamentInscription } from './entities/tournament-inscription.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TournamentInscription) private readonly inscriptionRepository: Repository<TournamentInscription>,
  ) {}

  // --- El resto de tus métodos (create, findAll, etc.) no necesitan cambios ---
  async create(createTournamentDto: CreateTournamentDto, organizer: User) {
    const newTournament = this.tournamentRepository.create({ ...createTournamentDto, organizer, });
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
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    if (tournament.organizer) {
      const { password, ...safeOrganizer } = tournament.organizer;
      return { ...tournament, organizer: safeOrganizer };
    }
    return tournament;
  }
  async findTournamentsByOrganizer(user: User) {
    const tournaments = await this.tournamentRepository.find({ where: { organizer: { id: user.id } } });
    return tournaments.map(tournament => {
        const { password, ...safeOrganizer } = tournament.organizer;
        return { ...tournament, organizer: safeOrganizer };
    });
  }
  async update(id: string, updateTournamentDto: UpdateTournamentDto, user: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to edit this tournament.');
    const tournamentToUpdate = await this.tournamentRepository.preload({ id, ...updateTournamentDto, });
    if (!tournamentToUpdate) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    const savedTournament = await this.tournamentRepository.save(tournamentToUpdate);
    const { password, ...safeOrganizer } = tournament.organizer;
    return { ...savedTournament, organizer: safeOrganizer };
  }
  async remove(id: string, user: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to delete this tournament.');
    await this.tournamentRepository.remove(tournament);
    return { message: `Tournament with ID "${id}" successfully removed.` };
  }

  // --- CORRECCIÓN DEFINITIVA ---
  async inscribeTeam(tournamentId: string, teamId: string, captain: User) {
    const tournament = await this.tournamentRepository.findOneBy({ id: tournamentId });
    if (!tournament) throw new NotFoundException('Tournament not found.');

    const team = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect('team.captain', 'captainUser') // Forzamos la unión con la tabla de usuarios
      .where('team.id = :id', { id: teamId })
      .getOne();

    // Línea de depuración para ver qué se obtiene
    console.log('EQUIPO ENCONTRADO EN inscribeTeam:', JSON.stringify(team, null, 2));

    if (!team) throw new NotFoundException('Team not found.');

    if (!team.captain) {
      throw new InternalServerErrorException('Captain relation not loaded for the team.');
    }

    if (team.captain.id !== captain.id) {
        throw new ForbiddenException('Only the team captain can inscribe the team.');
    }
    
    const inscription = this.inscriptionRepository.create({ tournamentId, teamId });
    await this.inscriptionRepository.save(inscription);
    
    return { message: 'Team successfully inscribed, pending approval.' };
  }
}
