import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { OrganizerController } from './organizer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TournamentInscription } from './entities/tournament-inscription.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Match } from 'src/matches/entities/match.entity';

@Module({
  controllers: [TournamentsController, OrganizerController],
  providers: [TournamentsService],
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentInscription, Team, Match]),
    AuthModule,
  ],
})
export class TournamentsModule {}
