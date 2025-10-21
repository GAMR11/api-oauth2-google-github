import {
    IsEmail,
    IsString,
    IsOptional,
    MinLength,
    Matches,
    IsEnum,
  } from 'class-validator';
  import { AuthProvider, UserRole } from '../entities/user.entity';
  
  export class CreateUserDto {
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        'Password must contain uppercase, lowercase, number and special character',
    })
    password?: string;
  
    @IsOptional()
    @IsString()
    firstName?: string;
  
    @IsOptional()
    @IsString()
    lastName?: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
  
    @IsOptional()
    @IsEnum(AuthProvider)
    provider?: AuthProvider;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  }