import { IsEnum, IsNotEmpty } from 'class-validator';

export enum InscriptionStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateInscriptionStatusDto {
  @IsEnum(InscriptionStatus)
  @IsNotEmpty()
  status: InscriptionStatus;
}
