import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para validar refresh tokens
 * Usa la estrategia 'jwt-refresh' de Passport
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}