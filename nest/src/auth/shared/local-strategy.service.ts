import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nickname',
      passwordField: 'password',
    });
  }

  async validate(
    nickname: string,
    password: string,
  ): Promise<{ id: number; nickname: string }> {
    return await this.authService.validate(nickname, password);
  }
}
