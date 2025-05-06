import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'process';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      // config 자체 모듈이 아니라 NestJS 에서 직접 제공하는걸 사용함
      isGlobal: true,
      validationSchema: Joi.object({
        // env 파일을 위한 validation schema
        HTTP_PORT: Joi.number().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
