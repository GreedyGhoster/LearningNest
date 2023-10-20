import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Проверка валидации пропсов
export class EditUserReq {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
