import { Controller, Get, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { CurrentUser } from '../../../libs/common/src/decorator/current-user.decorator';

import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@app/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  authenticate(@Payload() data: any) {
    return data.user;
  }
}
