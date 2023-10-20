import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthReq } from './req';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Функция для превращения user в токен jwt
  async signToken(userId: number, email: string) {
    // Определяем данные для токениризации
    const payload = {
      sub: userId,
      email,
    };

    // Используем конфиг для получения jwt_secret из .env
    const secret = await this.config.get('JWT_SECRET');

    // Создаем токен на основании данных
    // Передаем сначала данные для токенерезации, а потом свойства для них
    // Токен будет меняться каждые 15m
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    // Возвращаем токен пользователя
    return {
      access_token: token,
    };
  }

  async signup(req: AuthReq) {
    // Пробуем выполнить этот кусок кода
    try {
      // Хэшируем пароль с помощью argon
      const hash = await argon.hash(req.password);

      // Сохраняем нового пользователя в базу данных
      const user = await this.prisma.user.create({
        data: {
          email: req.email,
          hash,
        },
      });

      // Возвращаем токен пользователя
      return this.signToken(user.id, user.email);
    } catch (err) {
      // Если ошибка PrismaClientKnownRequestError
      if (err instanceof PrismaClientKnownRequestError) {
        // И если код ошибки P2002 (Prisma2002)
        if (err.code === 'P2002') {
          // Возвращаем сообщение об ошибке
          throw new ForbiddenException('The user already exists');
        }
        // Возващаем ошибку
        throw err;
      }
    }
  }

  async signin(req: AuthReq) {
    // Находим пользователя по email
    const user = await this.prisma.user.findFirst({
      where: {
        email: req.email,
      },
    });
    // Если он не существует, то появляется ошибка
    if (!user) throw new ForbiddenException('The user does not exist!');

    // Сравниваем правильный ли введенный пароль по его хэшу
    const pwMatches = await argon.verify(user.hash, req.password);

    // Если введен неправильно, то появляется ошибка
    if (!pwMatches) throw new ForbiddenException('The password is incorrect');

    // Возвращаем токен пользователя
    return this.signToken(user.id, user.email);
  }
}
