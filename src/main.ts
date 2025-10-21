import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // ✅ Especificar tipo NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config Service
  const configService = app.get(ConfigService);

  // ✅ Trust proxy (para obtener IP real detrás de NGINX, AWS ELB, etc.)
  app.set('trust proxy', true);

  // ✅ Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Prefijo global de API
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ✅ CORS (permitir peticiones desde frontend)
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:3001',
    credentials: true,
  });

  // Puerto
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 Auth Service OAuth2 is running!                 ║
  ║                                                       ║
  ║   📍 Local:    http://localhost:${port}/${apiPrefix}          ║
  ║   📖 Health:   http://localhost:${port}/${apiPrefix}/health   ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
}
bootstrap();