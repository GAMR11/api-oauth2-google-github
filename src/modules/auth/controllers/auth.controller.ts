import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Req,
    Res,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import type { Request, Response } from 'express';
//   import { Request, Response } from 'express';
  import { AuthService } from '../services/auth.service';
  import { RegisterDto } from '../dto/register.dto';
  import { LoginDto } from '../dto/login.dto';
  import { RefreshTokenDto } from '../dto/refresh-token.dto';
  import { LocalAuthGuard } from '../guards/local-auth.guard';
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';
  import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
  import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
  import { GitHubOAuthGuard } from '../guards/github-oauth.guard';
  import { CurrentUser } from '../decorators/current-user.decorator';
  import { Public } from '../decorators/public.decorator';
  import { User } from '../../users/entities/user.entity';
  import { ConfigService } from '@nestjs/config';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
    ) {}
  
    /**
     * Helper para extraer metadata de la request
     */
    private getRequestMetadata(req: Request) {
      return {
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      };
    }
  
    /**
     * POST /auth/register
     * Registro de nuevo usuario
     */
    @Public()
    @Post('register')
    async register(
      @Body() registerDto: RegisterDto,
      @Req() req: Request,
    ) {
      const { ip, userAgent } = this.getRequestMetadata(req);
      return this.authService.register(registerDto, ip, userAgent);
    }
  
    /**
     * POST /auth/login
     * Login con email/password
     */
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
      @Body() loginDto: LoginDto,
      @CurrentUser() user: User,
      @Req() req: Request,
    ) {
      const { ip, userAgent } = this.getRequestMetadata(req);
      const tokens = await this.authService.login(user, ip, userAgent);
  
      return {
        user,
        ...tokens,
      };
    }
  
    /**
     * POST /auth/refresh
     * Renovar access token con refresh token
     */
    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
      @Body() refreshTokenDto: RefreshTokenDto,
      @Req() req: Request,
    ) {
      const { ip, userAgent } = this.getRequestMetadata(req);
  
      return this.authService.refreshAccessToken(
        refreshTokenDto.refreshToken,
        ip,
        userAgent,
      );
    }
  
    /**
     * POST /auth/logout
     * Cerrar sesión (revocar refresh token)
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() refreshTokenDto: RefreshTokenDto) {
      await this.authService.logout(refreshTokenDto.refreshToken);
      return { message: 'Logged out successfully' };
    }
  
    /**
     * POST /auth/logout-all
     * Cerrar sesión en todos los dispositivos
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    @HttpCode(HttpStatus.OK)
    async logoutAll(@CurrentUser('id') userId: string) {
      await this.authService.logoutAll(userId);
      return { message: 'Logged out from all devices' };
    }
  
    /**
     * GET /auth/me
     * Obtener perfil del usuario autenticado
     */
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user: User) {
      return user;
    }
  
    // ==================== GOOGLE OAUTH ====================
  
    /**
     * GET /auth/google
     * Iniciar login con Google
     */
    @Public()
    @UseGuards(GoogleOAuthGuard)
    @Get('google')
    async googleAuth() {
      // Guard redirige a Google
    }
  
    /**
     * GET /auth/google/callback
     * Callback de Google OAuth
     */
    @Public()
    @UseGuards(GoogleOAuthGuard)
    @Get('google/callback')
    async googleAuthCallback(
      @CurrentUser() user: User,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      const { ip, userAgent } = this.getRequestMetadata(req);
      const tokens = await this.authService.login(user, ip, userAgent);
  
      // Redirigir al frontend con tokens
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      //para desarrollo devolvemos json
      return res.json({
        user,
        ...tokens,
      });
      //para producción con frontend disponible.
      return res.redirect(redirectUrl);
    }
  
    // ==================== GITHUB OAUTH ====================
  
    /**
     * GET /auth/github
     * Iniciar login con GitHub
     */
    @Public()
    @UseGuards(GitHubOAuthGuard)
    @Get('github')
    async githubAuth() {
      // Guard redirige a GitHub
    }
  
    /**
     * GET /auth/github/callback
     * Callback de GitHub OAuth
     */
    @Public()
    @UseGuards(GitHubOAuthGuard)
    @Get('github/callback')
    async githubAuthCallback(
      @CurrentUser() user: User,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      const { ip, userAgent } = this.getRequestMetadata(req);
      const tokens = await this.authService.login(user, ip, userAgent);
  
      // Redirigir al frontend con tokens
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
  
      return res.redirect(redirectUrl);
    }
  }