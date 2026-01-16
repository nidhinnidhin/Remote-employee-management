import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/infrastructure/auth/auth.module';
import { MongoDatabaseModule } from './modules/auth/infrastructure/database/mongoose/schemas/mongoose.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
