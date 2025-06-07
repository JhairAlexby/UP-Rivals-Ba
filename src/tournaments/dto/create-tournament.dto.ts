import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;
  
  @IsString()
  @IsNotEmpty()
  modality: string;

  @IsNumber()
  @IsNotEmpty()
  maxTeams: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsOptional()
  rules?: string;
}
