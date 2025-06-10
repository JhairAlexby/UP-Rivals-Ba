import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { UpdateInscriptionStatusDto } from './dto/update-inscription.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // --- Endpoint para crear un nuevo torneo ---
  // Protegido: Solo usuarios con rol 'organizer' pueden acceder.
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ORGANIZER)
  create(
    @Body() createTournamentDto: CreateTournamentDto,
    @GetUser() organizer: User,
  ) {
    return this.tournamentsService.create(createTournamentDto, organizer);
  }

  // --- Endpoint público para obtener todos los torneos ---
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }
  
  // --- Endpoint protegido para que un usuario vea sus torneos creados ---
  @Get('my-tournaments')
  @UseGuards(AuthGuard('jwt'))
  findMyTournaments(@GetUser() user: User) {
    return this.tournamentsService.findTournamentsByOrganizer(user);
  }

  // --- Endpoint público para obtener un torneo por su ID ---
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  // --- Endpoint protegido para actualizar un torneo ---
  // Protegido: Solo el organizador que creó el torneo puede actualizarlo.
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  update(
    @Param('id') id: string, 
    @Body() updateTournamentDto: UpdateTournamentDto,
    @GetUser() user: User,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto, user);
  }

  // --- Endpoint protegido para eliminar un torneo ---
  // Protegido: Solo el organizador que creó el torneo puede eliminarlo.
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.tournamentsService.remove(id, user);
  }

  // --- Endpoint protegido para inscribir un equipo a un torneo ---
  // Protegido: Solo el capitán del equipo puede inscribirlo.
  @Post(':tournamentId/inscribe/:teamId')
  @UseGuards(AuthGuard('jwt'))
  inscribeTeam(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
    @GetUser() captain: User,
  ) {
    return this.tournamentsService.inscribeTeam(tournamentId, teamId, captain);
  }

  // --- Endpoint protegido para ver las inscripciones de un torneo ---
  // Protegido: Solo el organizador del torneo puede ver las solicitudes.
  @Get(':tournamentId/inscriptions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  getInscriptions(
    @Param('tournamentId') tournamentId: string,
    @GetUser() user: User,
  ) {
    return this.tournamentsService.getInscriptions(tournamentId, user);
  }

  // --- Endpoint protegido para aprobar/rechazar una inscripción ---
  // Protegido: Solo el organizador del torneo puede gestionar las solicitudes.
  @Patch(':tournamentId/inscriptions/:teamId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  updateInscriptionStatus(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
    @Body() updateDto: UpdateInscriptionStatusDto,
    @GetUser() user: User,
  ) {
    return this.tournamentsService.updateInscriptionStatus(tournamentId, teamId, updateDto, user);
  }
}
