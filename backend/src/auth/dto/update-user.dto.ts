import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  role?: Role;
}
