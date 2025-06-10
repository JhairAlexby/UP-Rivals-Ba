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

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ORGANIZER)
  create(
    @Body() createTournamentDto: CreateTournamentDto,
    @GetUser() organizer: User,
  ) {
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
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER)
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.tournamentsService.remove(id, user);
  }

  // Añadimos el guardia de autenticación para proteger la ruta
  @Post(':tournamentId/inscribe/:teamId')
  @UseGuards(AuthGuard('jwt'))
  inscribeTeam(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
    @GetUser() captain: User,
  ) {
    return this.tournamentsService.inscribeTeam(tournamentId, teamId, captain);
  }
}
