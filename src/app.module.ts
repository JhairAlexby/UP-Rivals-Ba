
import { randomUUID } from 'crypto';
if (typeof global.crypto !== 'object') {
  (global as any).crypto = {};
}
if (typeof global.crypto.randomUUID !== 'function') {
  (global as any).crypto.randomUUID = randomUUID;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';


import { User } from './auth/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { TeamMember } from './teams/entities/team-member.entity';
import { Tournament } from './tournaments/entities/tournament.entity';
import { TournamentInscription } from './tournaments/entities/tournament-inscription.entity';
import { Match } from './matches/entities/match.entity';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 5432),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),


        entities: [ User, Team, TeamMember, Tournament, TournamentInscription, Match ],

        synchronize: true,
      }),
    }),

    AuthModule,
    TournamentsModule,
    TeamsModule,
    MatchesModule,
    SeedModule,
    FilesModule,

  ],
})
export class AppModule {}