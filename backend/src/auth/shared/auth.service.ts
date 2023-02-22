import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../repositories/user-repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  async validate(
    nickname: string,
    password: string,
    remember: boolean,
  ): Promise<{ id: number; nickname: string; remember: boolean }> {
    console.log('validate in auth.service called');
    try {
      const user = await this.userRepository.validate(nickname, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = user;
      console.log('validate() in auth.service ->', { ...rest, remember });
      return { ...rest, remember };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            'Nickname ou senha errados, não foi possível logar.',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }

      throw error;
    }
  }

  async login(user: { id: number; nickname: string }, remember: boolean) {
    const payload = { nickname: user.nickname, sub: user.id };
    const tokenExp = remember ? '336h' : '2h';

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: tokenExp }),
    };
  }
}
