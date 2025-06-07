import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('tournaments')
@UseGuards(AuthGuard('jwt')) // Protege todos los endpoints de este controlador
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(RolesGuard) // Aplica el guardia de roles
  @Roles(UserRole.ORGANIZER) // Solo los organizadores pueden acceder
  create(
    @Body() createTournamentDto: CreateTournamentDto,
    @GetUser() organizer: User,
  ) {
    return this.tournamentsService.create(createTournamentDto, organizer);
  }
}
