import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  // Microservice 설정 기본적인 TCP 레이어를 통해 통신하기로 설정 함
  app.connectMicroservice({ 
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    }
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(Logger));


  // Microservice 설정을 한 것을 기동함.
  await app.startAllMicroservices();

  await app.listen(Number(configService.get('HTTP_PORT')));
}
bootstrap();
