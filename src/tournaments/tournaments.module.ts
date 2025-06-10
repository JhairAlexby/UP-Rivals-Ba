import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TournamentInscription } from './entities/tournament-inscription.entity';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentInscription, Team]),
    AuthModule,
  ],
})
export class TournamentsModule {}
