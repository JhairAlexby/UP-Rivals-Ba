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

  // --- Endpoints de Torneos ---
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ORGANIZER)
  create(@Body() createTournamentDto: CreateTournamentDto, @GetUser() organizer: User) {
    return this.tournamentsService.create(createTournamentDto, organizer);
  }

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }
  
  @Get('my-tournaments')
  @UseGuards(AuthGuard('jwt'))
  findMyTournaments(@GetUser() user: User) {
    return this.tournamentsService.findTournamentsByOrganizer(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.tournamentsService.findOneWithRegistrationStatus(id, user);
  }

  @Get(':id/public')
  findOnePublic(@Param('id') id: string) {
    return this.tournamentsService.findOnePublic(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto, @GetUser() user: User) {
    return this.tournamentsService.update(id, updateTournamentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.tournamentsService.remove(id, user);
  }

  // --- Endpoints de Inscripciones ---
  @Post(':tournamentId/inscribe/:teamId')
  @UseGuards(AuthGuard('jwt'))
  inscribeTeam(@Param('tournamentId') tournamentId: string, @Param('teamId') teamId: string, @GetUser() captain: User) {
    return this.tournamentsService.inscribeTeam(tournamentId, teamId, captain);
  }

  @Get(':tournamentId/inscriptions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  getInscriptions(@Param('tournamentId') tournamentId: string, @GetUser() user: User) {
    return this.tournamentsService.getInscriptions(tournamentId, user);
  }

  @Patch(':tournamentId/inscriptions/:teamId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  updateInscriptionStatus(@Param('tournamentId') tournamentId: string, @Param('teamId') teamId: string, @Body() updateDto: UpdateInscriptionStatusDto, @GetUser() user: User) {
    return this.tournamentsService.updateInscriptionStatus(tournamentId, teamId, updateDto, user);
  }

  // --- Endpoint de Generación Automática ---
  @Post(':id/generate-schedule')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  generateSchedule(@Param('id') tournamentId: string, @GetUser() user: User) {
    return this.tournamentsService.generateSchedule(tournamentId, user);
  }

  @Get(':id/standings')
  getStandings(@Param('id') tournamentId: string) {
    return this.tournamentsService.getStandings(tournamentId);
  }


  // --- Endpoint público para ver los partidos de un torneo ---
  @Get(':id/matches')
  getMatches(@Param('id') tournamentId: string) {
    return this.tournamentsService.getMatches(tournamentId);
  }

}
