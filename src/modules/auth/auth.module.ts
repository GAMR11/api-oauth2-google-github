import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Services
import { AuthService } from './services/auth.service';

// Controllers
import { AuthController } from './controllers/auth.controller';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

// Entities
import { OAuthAccount } from './entities/oauth-account.entity';

// Módulos dependientes
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    // Configuración de Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // TypeORM - Entidades del módulo Auth
    TypeOrmModule.forFeature([OAuthAccount]),
    
    // Config Module
    ConfigModule,
    
    // Módulos dependientes
    UsersModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Strategies
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    GitHubStrategy,
  ],
  exports: [AuthService], // Por si otros módulos lo necesitan
})
export class AuthModule {}