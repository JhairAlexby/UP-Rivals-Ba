import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [
    TypeOrmModule.forFeature([Match, Tournament, Team]), 
    AuthModule,
  ],
})
export class MatchesModule {}
