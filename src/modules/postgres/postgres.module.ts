import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import postgresConfig from '../../config/postgres.config';
import { postgresProviders } from './postgres.providers';

@Module({
  imports: [ConfigModule.forRoot({ load: [appConfig, postgresConfig] })],
  providers: [...postgresProviders],
  exports: [...postgresProviders],
})
export class PostgresModule {}
