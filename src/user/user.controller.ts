import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')

  // Функция getMe
  // Принимает в себя декоратор GetUser
  // user соответсвует User
  getMe(@GetUser() user: User) {
    return user;
  }

  // Обновление данных пользователя
  @Patch()
  editUser() {}
}
