import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { UsersService } from '../../users/services/users.service';
  import { TokenService } from '../../tokens/services/token.service';
  import { RegisterDto } from '../dto/register.dto';
  import { AuthResponseDto } from '../dto/auth-response.dto';
  import { User, AuthProvider } from '../../users/entities/user.entity';
  import { OAuthProfile } from '../interfaces/oauth-profile.interface';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { OAuthAccount } from '../entities/oauth-account.entity';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly tokenService: TokenService,
      @InjectRepository(OAuthAccount)
      private readonly oauthAccountRepository: Repository<OAuthAccount>,
    ) {}
  
    /**
     * Valida credenciales de usuario (usado por LocalStrategy)
     */
    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.usersService.findByEmail(email);
  
      if (!user || !user.password) {
        return null;
      }
  
      const isPasswordValid = await this.usersService.validatePassword(
        password,
        user.password,
      );
  
      if (!isPasswordValid) {
        return null;
      }
  
      // Remover password del objeto
      const { password: _, ...result } = user;
      return result as User;
    }
  
    /**
     * Login tradicional (email/password)
     */
    async login(
      user: User,
      ip?: string,
      userAgent?: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
      return this.tokenService.generateTokens(user, ip, userAgent);
    }
  
    /**
     * Registro de nuevo usuario
     */
    async register(
      registerDto: RegisterDto,
      ip?: string,
      userAgent?: string,
    ): Promise<AuthResponseDto> {
      // Crear usuario
      const user = await this.usersService.create({
        ...registerDto,
        provider: AuthProvider.LOCAL,
      });
  
      // Generar tokens
      const tokens = await this.tokenService.generateTokens(user, ip, userAgent);
  
      return {
        user,
        tokens,
      };
    }
  
    /**
     * Refresh access token
     */
    async refreshAccessToken(
      refreshToken: string,
      ip?: string,
      userAgent?: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
      // Validar refresh token
      const payload = await this.tokenService.validateRefreshToken(refreshToken);
  
      // Obtener usuario
      const user = await this.usersService.findById(payload.sub);
  
      // Revocar el refresh token viejo (rotación de tokens)
      await this.tokenService.revokeRefreshToken(payload.tokenId);
  
      // Generar nuevos tokens
      return this.tokenService.generateTokens(user, ip, userAgent);
    }
  
    /**
     * Logout (revocar refresh token)
     */
    async logout(refreshToken: string): Promise<void> {
      try {
        const payload = await this.tokenService.validateRefreshToken(refreshToken);
        await this.tokenService.revokeRefreshToken(payload.tokenId);
      } catch (error) {
        // Si el token ya es inválido, no hacer nada
      }
    }
  
    /**
     * Logout de todos los dispositivos
     */
    async logoutAll(userId: string): Promise<void> {
      await this.tokenService.revokeAllUserTokens(userId);
    }
  
    /**
     * Login/Register con OAuth (Google, GitHub, etc.)
     */
    async validateOAuthUser(profile: OAuthProfile): Promise<User> {
      // Buscar cuenta OAuth existente
      let oauthAccount = await this.oauthAccountRepository.findOne({
        where: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
        relations: ['user'],
      });
  
      if (oauthAccount) {
        // Actualizar tokens de OAuth
        oauthAccount.accessToken = profile.accessToken;
        oauthAccount.refreshToken = profile.refreshToken;
        await this.oauthAccountRepository.save(oauthAccount);
  
        return oauthAccount.user;
      }
  
      // Si no existe, buscar usuario por email
      let user = await this.usersService.findByEmail(profile.email);
  
      if (user) {
        // Usuario existe, vincular cuenta OAuth
        oauthAccount = this.oauthAccountRepository.create({
          provider: profile.provider,
          providerId: profile.providerId,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          user,
        });
  
        await this.oauthAccountRepository.save(oauthAccount);
        return user;
      }
  
      // Crear nuevo usuario con OAuth
      user = await this.usersService.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar,
        provider: profile.provider,
        // isEmailVerified: true, // OAuth emails son pre-verificados
      });
  
      // Crear cuenta OAuth
      oauthAccount = this.oauthAccountRepository.create({
        provider: profile.provider,
        providerId: profile.providerId,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
        profile: profile as any,
        user,
      });
  
      await this.oauthAccountRepository.save(oauthAccount);
  
      return user;
    }
  }