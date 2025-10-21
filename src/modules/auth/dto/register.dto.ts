import {
    IsEmail,
    IsString,
    MinLength,
    Matches,
    IsOptional,
  } from 'class-validator';
  
  export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;
  
    @IsOptional()
    @IsString()
    firstName?: string;
  
    @IsOptional()
    @IsString()
    lastName?: string;
  }