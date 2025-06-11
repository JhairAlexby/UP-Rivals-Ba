import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { User } from 'src/auth/entities/user.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createMatchDto: CreateMatchDto, user: User) {
    const { tournamentId, teamAId, teamBId, date } = createMatchDto;

    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId }, relations: { organizer: true } });
    if (!tournament) throw new NotFoundException(`Tournament with ID ${tournamentId} not found.`);
    if (tournament.organizer.id !== user.id) {
      throw new ForbiddenException('You do not have permission to create matches for this tournament.');
    }

    const teamA = await this.teamRepository.findOne({ where: { id: teamAId }, relations: { captain: true } });
    const teamB = await this.teamRepository.findOne({ where: { id: teamBId }, relations: { captain: true } });
    if (!teamA || !teamB) throw new NotFoundException('One or both teams were not found.');

    const newMatch = this.matchRepository.create({
      tournament,
      teamA,
      teamB,
      date,
    });

    await this.matchRepository.save(newMatch);

    // --- CORRECCIÓN DE SEGURIDAD ---
    // Sanitizamos la respuesta para eliminar todas las contraseñas.
    const { password: orgPassword, ...safeOrganizer } = newMatch.tournament.organizer;
    const { password: capAPassword, ...safeCaptainA } = newMatch.teamA.captain;
    const { password: capBPassword, ...safeCaptainB } = newMatch.teamB.captain;

    return {
      ...newMatch,
      tournament: { ...newMatch.tournament, organizer: safeOrganizer },
      teamA: { ...newMatch.teamA, captain: safeCaptainA },
      teamB: { ...newMatch.teamB, captain: safeCaptainB },
    };
  }

  async updateResult(matchId: string, updateDto: UpdateMatchResultDto, user: User) {
    // Para sanitizar la respuesta, necesitamos cargar todas las relaciones.
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: {
        tournament: { organizer: true },
        teamA: { captain: true },
        teamB: { captain: true },
      },
    });
    if (!match) throw new NotFoundException(`Match with ID ${matchId} not found.`);

    if (match.tournament.organizer.id !== user.id) {
      throw new ForbiddenException('You do not have permission to update results for this match.');
    }

    match.teamAScore = updateDto.teamAScore;
    match.teamBScore = updateDto.teamBScore;
    match.status = 'finished';

    const updatedMatch = await this.matchRepository.save(match);

    const { password: orgPassword, ...safeOrganizer } = updatedMatch.tournament.organizer;
    const { password: capAPassword, ...safeCaptainA } = updatedMatch.teamA.captain;
    const { password: capBPassword, ...safeCaptainB } = updatedMatch.teamB.captain;

    return {
      ...updatedMatch,
      tournament: { ...updatedMatch.tournament, organizer: safeOrganizer },
      teamA: { ...updatedMatch.teamA, captain: safeCaptainA },
      teamB: { ...updatedMatch.teamB, captain: safeCaptainB },
    };
  }
}
