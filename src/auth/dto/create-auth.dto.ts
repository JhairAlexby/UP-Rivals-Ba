import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateAuthDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  @Matches(/^[^@]+@([a-zA-Z0-9-]+\.)*upchiapas\.edu\.mx$/,
    {
      message: 'Solo se permiten correos institucionales de la UPChiapas.',
    },
  )
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido.' })
  @IsOptional()
  role?: UserRole;

  @IsUrl({}, { message: 'La foto de perfil debe ser una URL válida.'})
  @IsOptional()
  profilePicture?: string;
}
