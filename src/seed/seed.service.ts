import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // <-- Importa DataSource
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TournamentInscription } from 'src/tournaments/entities/tournament-inscription.entity';
import { Match } from 'src/matches/entities/match.entity';
import { TeamMember } from 'src/teams/entities/team-member.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource, // <-- Inyecta DataSource
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TournamentInscription) private readonly inscriptionRepository: Repository<TournamentInscription>,
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  async executeSeed() {
    // --- CORRECCIÓN DEFINITIVA ---
    // Usamos una consulta SQL directa para truncar todas las tablas en cascada.
    // Esto respeta las restricciones de clave foránea y reinicia las secuencias.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.query('TRUNCATE TABLE "user", "tournament", "team", "match", "team_member", "tournament_inscription" RESTART IDENTITY CASCADE;');

    // 2. Crear usuarios de prueba
    const passwordHash = bcrypt.hashSync('PasswordTest123!', 10);
    
    const organizer = await this.userRepository.save(
      this.userRepository.create({
        name: 'Organizador UP Chiapas',
        email: 'organizer@upchiapas.edu.mx',
        password: passwordHash,
        role: UserRole.ORGANIZER,
      }),
    );

    const players: User[] = [];
    for (let i = 1; i <= 4; i++) {
      const player = await this.userRepository.save(
        this.userRepository.create({
          name: `Jugador ${i}`,
          email: `player${i}@upchiapas.edu.mx`,
          password: passwordHash,
          role: UserRole.PLAYER,
        }),
      );
      players.push(player);
    }
    
    // 3. Crear un torneo
    const tournament = await this.tournamentRepository.save(
      this.tournamentRepository.create({
        name: 'Torneo de Prueba de Fútbol',
        category: 'Fútbol',
        modality: 'Varonil',
        maxTeams: 8,
        startDate: new Date(),
        endDate: new Date(),
        organizer: organizer,
      }),
    );

    // 4. Crear equipos
    const teams: Team[] = [];
    for (let i = 0; i < 4; i++) {
        const team = await this.teamRepository.save(
            this.teamRepository.create({
                name: `Equipo ${i + 1}`,
                captain: players[i]
            })
        );
        teams.push(team);
    }

    // 5. Inscribir los equipos al torneo
    for (const team of teams) {
        await this.inscriptionRepository.save(
            this.inscriptionRepository.create({
                tournamentId: tournament.id,
                teamId: team.id
            })
        );
    }
    
    // 6. Aprobar las primeras 3 inscripciones
    const inscriptions = await this.inscriptionRepository.find();
    for(let i = 0; i < 3; i++) {
        inscriptions[i].status = 'approved';
        await this.inscriptionRepository.save(inscriptions[i]);
    }

    return { message: 'Seed executed successfully: 1 organizer, 4 players, 1 tournament, and 4 teams created and inscribed.' };
  }
}
