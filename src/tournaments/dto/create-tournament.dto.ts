import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; 

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

  @Type(() => Date) 
  @IsDate() 
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date) 
  @IsDate() 
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsOptional()
  rules?: string;
}
