import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateMatchResultDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  teamAScore: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  teamBScore: number;
}
