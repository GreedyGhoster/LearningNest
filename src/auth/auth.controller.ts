import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller({})
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService.login();
    this.authService.signup();
  }
}
