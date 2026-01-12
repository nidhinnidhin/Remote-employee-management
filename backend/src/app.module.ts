import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseModule } from './infrastructure/database/mongoose/mongoose.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongoDatabaseModule],
})
export class AppModule {}
