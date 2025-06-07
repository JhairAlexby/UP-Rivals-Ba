import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';


export class CreateAuthDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  name: string;

  @IsEmail({}, { message: 'The email format is invalid.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password is not strong enough. It must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(UserRole, {
    message: 'Role must be one of the allowed values: organizer or player.',
  })
  @IsOptional()
  role?: UserRole;
}
