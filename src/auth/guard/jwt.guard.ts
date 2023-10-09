import { AuthGuard } from '@nestjs/passport';

// Защитник Jwt расширяет AuthGuard по jwt методу
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
