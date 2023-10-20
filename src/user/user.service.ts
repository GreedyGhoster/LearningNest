import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserReq } from './req';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, req: EditUserReq) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...req,
      },
    });

    delete user.hash;

    return user;
  }
}
