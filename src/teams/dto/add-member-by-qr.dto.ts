import { IsString, IsNotEmpty } from 'class-validator';

export class AddMemberByQrDto {
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}