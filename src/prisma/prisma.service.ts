import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
// Расширяем возможности сервиса
export class PrismaService extends PrismaClient {
  // Импортируем конфиг
  constructor(config: ConfigService) {
    // Через супер принемаем url базы данных по конфигу
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  // Очистка базы данных от некоторых таблиц
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
