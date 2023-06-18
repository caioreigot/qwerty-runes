import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nickname',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    nickname: string,
    password: string,
  ): Promise<{ id: number; nickname: string }> {
    const remember = (request.body as any).remember ?? false;
    return await this.authService.validate(nickname, password, remember);
  }
}
