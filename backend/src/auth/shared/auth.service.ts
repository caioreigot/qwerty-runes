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
    try {
      const user = await this.userRepository.validate(nickname, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = user;
      return { ...rest, remember };
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new HttpException(
          'Nickname ou senha errados, não foi possível logar.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw error;
    }
  }

  async buildAndSendToken(nickname: string, remember: boolean) {
    const payload = { nickname: nickname };
    const tokenExp = remember ? '72h' : '6h';

    const options = {
      expiresIn: tokenExp
    }

    return {
      access_token: this.jwtService.sign(payload, options),
    };
  }
}
