import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Проверка валидации пропсов
export class AuthReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
