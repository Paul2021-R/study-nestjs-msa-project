import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 추가하면 쓸데없는 데이터들이 들어올 경우 엄격하게 해당 데이터를 제거한다.
    }),
  );
  app.use(cookieParser());

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  await app.listen(Number(configService.get('PORT')));
}
bootstrap();
