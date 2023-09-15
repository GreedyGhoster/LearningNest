import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin(): object {
    return { msg: 'I have signed in' };
  }
  signup(): object {
    return { msg: 'I have signed up' };
  }
}
