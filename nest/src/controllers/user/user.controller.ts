import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserBody } from '../../dtos/user-body';
import { UserRepository } from '../../repositories/user-repository';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post('create')
  async create(@Body() body: UserBody): Promise<void> {
    try {
      await this.userRepository.create(body.nickname, body.password);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Este nickname já está em uso! Por favor, escolha outro.',
            HttpStatus.CONFLICT,
          );
        }
      }

      throw error;
    }
  }

  @Post('validate')
  async validate(@Body() body: UserBody): Promise<void> {
    try {
      await this.userRepository.validate(body.nickname, body.password);
    } catch (error) {
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
}
