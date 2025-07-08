import { Controller, Get, UseGuards } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { TeamsService } from 'src/teams/teams.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly teamsService: TeamsService,
  ) {}

  /**
   * Obtiene todos los torneos en los que está inscrito el usuario autenticado
   * GET /player/my-tournaments
   */
  @Get('my-tournaments')
  @UseGuards(AuthGuard('jwt'))
  getMyTournaments(@GetUser() user: User) {
    return this.tournamentsService.findTournamentsByPlayer(user);
  }

  /**
   * Obtiene todos los equipos creados por el usuario autenticado con información del torneo
   * GET /player/teams
   */
  @Get('teams')
  @UseGuards(AuthGuard('jwt'))
  getMyTeams(@GetUser() user: User) {
    return this.teamsService.findTeamsByPlayer(user);
  }
}