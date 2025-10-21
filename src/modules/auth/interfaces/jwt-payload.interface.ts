import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface JwtRefreshPayload {
  sub: string;
  tokenId: string; // refresh token id in database
}