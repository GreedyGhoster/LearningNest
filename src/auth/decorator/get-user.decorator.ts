import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Создаем декорато для получения пользователя
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Запрос по протоколу http
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      // Возвращает конкретные данные пользователя, если есть data
      return request.user[data];
    }
    return request.user;
  },
);
