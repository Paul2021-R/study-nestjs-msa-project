import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe( {
    whitelist: true // 추가하면 쓸데없는 데이터들이 들어올 경우 엄격하게 해당 데이터를 제거한다.
  } ));
  app.useLogger(app.get(Logger))

  const configService = app.get(ConfigService);

  await app.listen(Number(configService.get('PORT')));

}
bootstrap();
