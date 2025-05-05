import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        // 로그 레벨을 명시적으로 설정합니다. 'debug'는 가장 상세한 로그를 보여줍니다.
        // 운영 환경에서는 'info'나 'warn'으로 조정할 수 있습니다.
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // HTTP 요청/응답 로그 외에 애플리케이션 로그(예: Logger.log, Logger.error)도
        // pino 형식으로 출력하도록 합니다. (autoLogging: false 와 함께 사용 가능)
        // customLogLevel을 사용하면 특정 상태 코드에 다른 로그 레벨을 지정할 수 있습니다.
        // 예를 들어 4xx 에러는 'warn', 5xx 에러는 'error' 레벨로 로깅합니다.
        customLogLevel: function (req, res, err) {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
             return 'silent'; // 리다이렉션은 보통 로깅 안 함 (선택 사항)
          }
          return 'info'; // 그 외는 info 레벨
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            // 에러 스택 트레이스를 포함하여 출력합니다.
            colorize: true, // 터미널에서 로그 가독성을 높입니다 (선택 사항).
            // messageKey: 'message', // 로그 메시지의 키를 지정 (선택 사항)
          },
        },
        // (선택 사항) 자동으로 기록되는 성공적인 HTTP 요청/응답 로그를 비활성화하려면 false로 설정
        // autoLogging: false,
        // (선택 사항) 에러 객체를 직렬화하는 방식을 커스터마이즈
        // serializers: {
        //   err: pino.stdSerializers.err,
        //   req: pino.stdSerializers.req,
        //   res: pino.stdSerializers.res,
        // },
      },
    }),
  ],
})
export class LoggerModule {}