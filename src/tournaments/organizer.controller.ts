import { Controller, Get, UseGuards } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  /**
   * Endpoint para obtener todas las solicitudes de inscripción pendientes
   * de todos los torneos creados por el organizador logueado
   * 
   * GET /organizer/inscriptions
   */
  @Get('inscriptions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  getAllPendingInscriptions(@GetUser() organizer: User) {
    return this.tournamentsService.getAllPendingInscriptionsByOrganizer(organizer);
  }

  /**
   * Endpoint para obtener todos los partidos pendientes de calificar
   * de todos los torneos creados por el organizador logueado
   * 
   * GET /organizer/pending-matches
   */
  @Get('pending-matches')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  getAllPendingMatches(@GetUser() organizer: User) {
    return this.tournamentsService.getAllPendingMatchesByOrganizer(organizer);
  }
}