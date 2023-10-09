import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  // Импортируем модуль jwt и регистрируем ничего
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  // JwtStrategy показывает стратегию jwt
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
