import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  role: Role;
}
