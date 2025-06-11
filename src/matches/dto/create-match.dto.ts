import { IsUUID, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer'; // <-- Importamos 'Type'

export class CreateMatchDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  teamAId: string;

  @IsUUID()
  teamBId: string;

  @Type(() => Date) // Ayuda a transformar el string del JSON a un objeto Date
  @IsDate() // Valida que el resultado sea un objeto Date válido
  @IsNotEmpty()
  date: Date;
}
