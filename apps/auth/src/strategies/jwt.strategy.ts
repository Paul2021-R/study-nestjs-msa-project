import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWT') {
  constructor(
    conrigService: ConfigService,
    private readonly usersServicve: UsersService,
  ) {
    const secretOrKey = conrigService.get<string>('JWT_SECRET') || '';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          console.log('req', req);
          return req?.cookies?.Authentication || req?.Authentication;
        },
      ]),
      secretOrKey: secretOrKey,
    });
  }
  public async validate({ userId }: TokenPayload) {
    return await this.usersServicve.getUser({ _id: userId });
  }
}
