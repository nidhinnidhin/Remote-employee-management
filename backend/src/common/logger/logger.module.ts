import { Global, Module } from '@nestjs/common';
import { LOGGER_SERVICE } from './tokens/logger.tokens';
import { AppLoggerService } from './services/app-logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_SERVICE,
      useClass: AppLoggerService,
    },
  ],

  exports: [LOGGER_SERVICE],
})
export class LoggerModule {}
