import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TournamentInscription } from 'src/tournaments/entities/tournament-inscription.entity';
import { Match } from 'src/matches/entities/match.entity';
import { TeamMember } from 'src/teams/entities/team-member.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([
      User, Tournament, Team, TournamentInscription, Match, TeamMember
    ])
  ]
})
export class SeedModule {}
