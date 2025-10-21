import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticación con GitHub OAuth
 */
@Injectable()
export class GitHubOAuthGuard extends AuthGuard('github') {}