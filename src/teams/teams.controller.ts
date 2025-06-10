import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @GetUser() captain: User) {
    return this.teamsService.create(createTeamDto, captain);
  }

  @Post(':teamId/members')
  addMember(
    @Param('teamId') teamId: string,
    @Body() addMemberDto: AddMemberDto,
    @GetUser() captain: User,
  ) {
    return this.teamsService.addMember(teamId, addMemberDto, captain);
  }
}
