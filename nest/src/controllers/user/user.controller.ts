import { AuthService } from 'src/auth/shared/auth.service';
import { LocalAuthGuard } from 'src/auth/shared/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserBody } from 'src/dtos/user-body';
import { UserRepository } from 'src/repositories/user-repository';

@Controller('user')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async validate(@Req() request: any): Promise<{ access_token: string }> {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login-with-token')
  hasToken(): void {
    return;
  }
}
