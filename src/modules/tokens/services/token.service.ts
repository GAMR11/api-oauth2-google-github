import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Genera access token JWT
   */
  generateAccessToken(user: User): string {
    const payload: any = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const jwtExpiration = this.configService.get<number>('JWT_EXPIRATION') || 36000;
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiration,
    });
  }

  /**
   * Genera refresh token y lo guarda en BD
   */
  async generateRefreshToken(
    user: User,
    ip?: string,
    userAgent?: string,
  ): Promise<string> {
    const tokenId = uuidv4();
    
    const payload: any = {
      sub: user.id,
      tokenId,
    };

    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const refreshExpiration = this.configService.get<number>('JWT_REFRESH_EXPIRATION') || 9000;

    const token = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiration,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      id: tokenId,
      token,
      user,
      expiresAt,
      ip,
      userAgent,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  /**
   * Genera ambos tokens
   */
  async generateTokens(
    user: User,
    ip?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, ip, userAgent);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Valida y decodifica refresh token
   */
  async validateRefreshToken(token: string): Promise<any> {
    try {
      const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
      
      const payload = this.jwtService.verify(token, {
        secret: refreshSecret,
      });

      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { id: payload.tokenId },
        relations: ['user'],
      });

      if (!refreshToken || !refreshToken.isValid()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revocar refresh token (logout)
   */
  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { id: tokenId },
      { isRevoked: true },
    );
  }

  /**
   * Revocar todos los tokens de un usuario (logout all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { id: userId } },
      { isRevoked: true },
    );
  }

  /**
   * Limpiar tokens expirados
   */
  async cleanExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}