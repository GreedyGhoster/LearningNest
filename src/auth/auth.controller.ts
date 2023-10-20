import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthReq } from './req';

@Controller()
export class AuthController {
  // Импортируем сервис авторизации и аутентификации
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  // На signin из body берутся значения, соответсвующие AuthReq
  signin(@Body() req: AuthReq) {
    return this.authService.signin(req);
  }

  @Post('signup')
  signup(@Body() req: AuthReq) {
    return this.authService.signup(req);
  }
}
