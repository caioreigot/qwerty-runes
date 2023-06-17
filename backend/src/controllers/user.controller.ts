import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from '../auth/shared/auth.service';
import { LocalAuthGuard } from '../auth/shared/local-auth.guard';
import { JwtAuthGuard } from '../auth/shared/jwt-auth.guard';
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
import { UserBody } from '../dtos/user-body';
import { UserRepository } from '../repositories/user-repository';
import { AdminGuard } from '../auth/shared/admin.guard';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

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

        throw error;
      }

      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async validate(@Req() request: any): Promise<{ access_token: string }> {
    return this.authService.login(request.user, request.body.remember);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token-login')
  hasToken(): void {
    return;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('is-admin')
  async isAdmin(): Promise<boolean> {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all-admin-nicknames')
  async getAllAdminNicknames(): Promise<string[]> {
    return this.userRepository.getAllAdminNicknames();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('remove-admin')
  async removeAdmin(@Req() request: Request): Promise<{ nickname: string }> {
    return this.userRepository.removeAdmin(request.body.nickname);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('add-admin')
  async addAdmin(@Req() request: Request): Promise<{ nickname: string }> {
    return this.userRepository.addAdmin(request.body.nickname);
  }
}
