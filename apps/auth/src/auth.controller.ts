import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { CurrentUser } from '../../../libs/common/src/decorator/current-user.decorator';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  authenticate(@Payload() data: any) {
    return data.user;
  }
}
