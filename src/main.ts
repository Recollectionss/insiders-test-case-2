import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const appConf: ConfigType<typeof appConfig> = configService.get('app');

  const config = new DocumentBuilder()
    .setTitle('Events')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(appConf.port);
}
bootstrap();
