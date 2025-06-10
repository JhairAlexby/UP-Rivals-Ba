import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('teams')
@UseGuards(AuthGuard('jwt')) 
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @GetUser() captain: User,
  ) {
    return this.teamsService.create(createTeamDto, captain);
  }
}
