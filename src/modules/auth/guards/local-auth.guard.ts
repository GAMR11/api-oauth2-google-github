import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticación local (email/password)
 * Usa la estrategia 'local' de Passport
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}