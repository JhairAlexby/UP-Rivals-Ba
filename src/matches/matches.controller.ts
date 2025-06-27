import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('matches')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles(UserRole.ORGANIZER) // Solo los organizadores pueden crear partidos
  create(@Body() createMatchDto: CreateMatchDto, @GetUser() user: User) {
    return this.matchesService.create(createMatchDto, user);
  }

  @Patch(':id/result')
  @Roles(UserRole.ORGANIZER) // Solo los organizadores pueden registrar resultados
  updateResult(
    @Param('id') matchId: string,
    @Body() updateResultDto: UpdateMatchResultDto,
    @GetUser() user: User,
  ) {
    return this.matchesService.updateResult(matchId, updateResultDto, user);
  }
}
