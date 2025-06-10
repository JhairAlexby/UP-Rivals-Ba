import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  logo?: string;
}
