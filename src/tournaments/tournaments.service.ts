import { Injectable, NotFoundException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/auth/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TournamentInscription } from './entities/tournament-inscription.entity';
import { Match } from 'src/matches/entities/match.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { UpdateInscriptionStatusDto } from './dto/update-inscription.dto';
import { StandingsEntryDto } from './dto/standings-entry.dto';
import { PendingInscriptionResponseDto } from './dto/pending-inscription-response.dto';
import { PlayerTournamentResponseDto } from './dto/player-tournament-response.dto';
import { TournamentWithRegistrationDto } from './dto/tournament-with-registration.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentInscription) private readonly inscriptionRepository: Repository<TournamentInscription>,
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    // Inyectamos TeamRepository para usarlo en el servicio de torneos
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}

  // ... (El resto de tus métodos como create, findAll, etc. no cambian)
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

  async findOneWithRegistrationStatus(id: string, user: User): Promise<TournamentWithRegistrationDto> {
    const tournament = await this.tournamentRepository.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Tournament with ID "${id}" not found`);

    // Verificar si el usuario está registrado en este torneo
    const userTeams = await this.teamRepository.find({
      where: [
        { captain: { id: user.id } }, // Equipos donde es capitán
        { members: { userId: user.id } } // Equipos donde es miembro
      ],
      relations: ['inscriptions']
    });

    // Verificar si alguno de los equipos del usuario está inscrito en este torneo
    const isRegistered = userTeams.some(team => 
      team.inscriptions.some(inscription => inscription.tournamentId === id)
    );

    return {
      ...tournament,
      isRegistered
    };
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
    const inscriptions = await this.inscriptionRepository.find({
      where: { tournamentId },
      relations: { team: { captain: true } },
    });
    return inscriptions;
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
  async generateSchedule(tournamentId: string, user: User) {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException('Tournament not found.');
    if (tournament.organizer.id !== user.id) throw new ForbiddenException('You do not have permission to generate the schedule for this tournament.');
    const approvedInscriptions = await this.inscriptionRepository.find({ where: { tournamentId, status: 'approved' }, relations: { team: true } });
    if (approvedInscriptions.length < 2) throw new ConflictException('At least two approved teams are required to generate a schedule.');
    const teams = approvedInscriptions.map(inscription => inscription.team);
    const shuffledTeams: (Team | null)[] = [...teams].sort(() => Math.random() - 0.5);
    const matchesToCreate: Match[] = [];
    const scheduleDate = new Date();
    if (shuffledTeams.length % 2 !== 0) shuffledTeams.push(null);
    const numTeams = shuffledTeams.length;
    const numRounds = numTeams - 1;
    for (let round = 0; round < numRounds; round++) {
      for (let i = 0; i < numTeams / 2; i++) {
        const teamA = shuffledTeams[i];
        const teamB = shuffledTeams[numTeams - 1 - i];
        if (teamA && teamB) {
          const matchDate = new Date(scheduleDate);
          matchDate.setDate(scheduleDate.getDate() + round);
          const match = this.matchRepository.create({ tournament, teamA, teamB, date: matchDate });
          matchesToCreate.push(match);
        }
      }
      const lastTeam = shuffledTeams.pop();
      if (lastTeam !== undefined) shuffledTeams.splice(1, 0, lastTeam);
    }
    await this.matchRepository.save(matchesToCreate);
    return { message: `${matchesToCreate.length} matches have been generated successfully.` };
  }

  // --- MÉTODO CON DEPURACIÓN AÑADIDA ---
  async getStandings(tournamentId: string): Promise<StandingsEntryDto[]> {
    console.log(`--- Iniciando getStandings para el torneo: ${tournamentId} ---`);

    // 1. Obtener todos los equipos aprobados para este torneo.
    const approvedInscriptions = await this.inscriptionRepository.find({
      where: { tournamentId, status: 'approved' },
      relations: { team: true },
    });
    console.log(`Equipos aprobados encontrados: ${approvedInscriptions.length}`);
    if (approvedInscriptions.length === 0) {
      console.log('No hay equipos aprobados. Devolviendo tabla vacía.');
      return [];
    }
    
    const teams = approvedInscriptions.map(inscription => inscription.team);

    // 2. Obtener todos los partidos finalizados del torneo.
    const finishedMatches = await this.matchRepository.find({
      where: { tournament: { id: tournamentId }, status: 'finished' },
      relations: { teamA: true, teamB: true },
    });
    console.log(`Partidos finalizados encontrados: ${finishedMatches.length}`);
    
    const standingsMap = new Map<string, StandingsEntryDto>();
    for (const team of teams) {
      standingsMap.set(team.id, {
        team, played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      });
    }

    for (const match of finishedMatches) {
      const statsA = standingsMap.get(match.teamA.id);
      const statsB = standingsMap.get(match.teamB.id);
      if (statsA && statsB) {
        statsA.played++;
        statsB.played++;
        const scoreA = match.teamAScore ?? 0;
        const scoreB = match.teamBScore ?? 0;
        statsA.goalsFor += scoreA;
        statsB.goalsFor += scoreB;
        statsA.goalsAgainst += scoreB;
        statsB.goalsAgainst += scoreA;
        if (scoreA > scoreB) {
          statsA.wins++;
          statsA.points += 3;
          statsB.losses++;
        } else if (scoreB > scoreA) {
          statsB.wins++;
          statsB.points += 3;
          statsA.losses++;
        } else {
          statsA.draws++;
          statsB.draws++;
          statsA.points += 1;
          statsB.points += 1;
        }
      }
    }
    
    const standings = Array.from(standingsMap.values());
    standings.forEach(entry => {
      entry.goalDifference = entry.goalsFor - entry.goalsAgainst;
    });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    });

    return standings;
  }

  async getMatches(tournamentId: string) {
    const tournament = await this.tournamentRepository.findOneBy({ id: tournamentId });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID "${tournamentId}" not found`);
    }

    return this.matchRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: {
        teamA: true,
        teamB: true,
      },
      order: {
        date: 'ASC'
      }
    });
  }

  /**
   * Obtiene todos los torneos en los que está inscrito un usuario
   * (ya sea como capitán o como miembro de un equipo)
   */
  async findTournamentsByPlayer(user: User): Promise<PlayerTournamentResponseDto[]> {
    // Obtener todos los equipos donde el usuario es miembro o capitán
    const userTeams = await this.teamRepository.find({
      where: [
        { captain: { id: user.id } }, // Equipos donde es capitán
        { members: { userId: user.id } } // Equipos donde es miembro
      ],
      relations: ['inscriptions', 'inscriptions.tournament', 'inscriptions.tournament.organizer']
    });

    // Extraer todos los torneos únicos de las inscripciones
    const tournaments = new Map<string, PlayerTournamentResponseDto>();

    userTeams.forEach(team => {
      team.inscriptions.forEach(inscription => {
        if (!tournaments.has(inscription.tournament.id)) {
          tournaments.set(inscription.tournament.id, {
            id: inscription.tournament.id,
            name: inscription.tournament.name,
            category: inscription.tournament.category,
            modality: inscription.tournament.modality,
            rules: inscription.tournament.rules,
            startDate: inscription.tournament.startDate,
            endDate: inscription.tournament.endDate,
            maxTeams: inscription.tournament.maxTeams,
            status: inscription.tournament.status,
            inscriptionStatus: inscription.status,
            teamName: team.name,
            teamId: team.id,
            organizer: {
              id: inscription.tournament.organizer.id,
              name: inscription.tournament.organizer.name,
              email: inscription.tournament.organizer.email
            }
          });
        }
      });
    });

    return Array.from(tournaments.values());
  }

  /**
   * Obtiene todas las solicitudes de inscripción pendientes 
   * de todos los torneos creados por el organizador logueado
   */
  async getAllPendingInscriptionsByOrganizer(organizer: User): Promise<PendingInscriptionResponseDto[]> {
    // Primero obtenemos todos los torneos del organizador
     const organizerTournaments = await this.tournamentRepository.find({
       where: { organizer: { id: organizer.id } },
       select: ['id', 'name', 'category', 'startDate', 'endDate']
     });

    if (organizerTournaments.length === 0) {
      return [];
    }

    // Extraemos los IDs de los torneos
    const tournamentIds = organizerTournaments.map(tournament => tournament.id);

    // Obtenemos todas las inscripciones pendientes de esos torneos
     const pendingInscriptions = await this.inscriptionRepository.find({
       where: {
         tournamentId: In(tournamentIds),
         status: 'pending'
       },
       relations: {
         team: {
           captain: true
         },
         tournament: true
       }
     });

    // Formateamos la respuesta para incluir información completa
     return pendingInscriptions.map(inscription => ({
       inscriptionId: `${inscription.tournamentId}-${inscription.teamId}`,
       status: inscription.status,
       team: {
         id: inscription.team.id,
         name: inscription.team.name,
         logo: inscription.team.logo,
         captain: {
           id: inscription.team.captain.id,
           email: inscription.team.captain.email,
           name: inscription.team.captain.name
         }
       },
       tournament: {
         id: inscription.tournament.id,
         name: inscription.tournament.name,
         category: inscription.tournament.category,
         startDate: inscription.tournament.startDate,
         endDate: inscription.tournament.endDate
       }
     }));
  }
}
