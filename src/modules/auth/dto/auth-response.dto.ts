import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class TokensDto {
  accessToken: string;
  refreshToken: string;
}