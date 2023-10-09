import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Делаем этот модуль глобальным
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
