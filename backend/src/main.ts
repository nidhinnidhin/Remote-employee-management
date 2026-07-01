// src/main.ts

import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { ResponseInterceptor } from './common/response/response.interceptor';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { ILogger } from './common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from './common/logger/tokens/logger.tokens';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<ILogger>(LOGGER_SERVICE);
  app.useLogger(logger as unknown as import('@nestjs/common').LoggerService);

  logger.log('Starting NestJS bootstrap...', 'Bootstrap');

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',           // local Docker / dev
      'https://stafflow.nidhintech.site', // production frontend
      process.env.FRONTEND_URL,          // from .env (fallback)
    ].filter(Boolean) as string[],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api');

  // Inside main.ts -> ValidationPipe configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const formattedErrors: Record<string, string[]> = {};

        const formatErrors = (errs) => {
          errs.forEach((error) => {
            if (error.constraints) {
              formattedErrors[error.property] = Object.values(
                error.constraints,
              );
            }
            if (error.children && error.children.length > 0) {
              formatErrors(error.children);
            }
          });
        };

        formatErrors(errors);

        console.log(
          '❌ VALIDATION PIPELINE ERROR:',
          JSON.stringify(formattedErrors, null, 2),
        );

        logger.warn('Validation failed', 'ValidationPipe');

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(`Backend is running on: http://0.0.0.0:${port}`, 'Bootstrap');
}

void bootstrap();
