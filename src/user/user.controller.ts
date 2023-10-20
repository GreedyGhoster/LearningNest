import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserReq } from './req';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Получение пользователя
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  // Обновление данных пользователя
  @Patch()
  editUser(@GetUser('id') userId: User['id'], @Body() req: EditUserReq) {
    return this.userService.editUser(userId, req);
  }
}
