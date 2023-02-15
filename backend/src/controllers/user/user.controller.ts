import { AuthService } from '../../auth/shared/auth.service';
import { LocalAuthGuard } from '../../auth/shared/local-auth.guard';
import { JwtAuthGuard } from '../../auth/shared/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserBody } from 'src/dtos/user-body';
import { UserRepository } from 'src/repositories/user-repository';
import { Request, Response } from 'express';
import { UtilsService } from '../shared/utils.service';

@Controller('user')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private utilsService: UtilsService,
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
    return this.authService.login(request.user, request.body.remember);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token-login')
  hasToken(): void {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-admin')
  async isAdmin(@Req() request: Request): Promise<boolean> {
    const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);
    return this.userRepository.isAdmin(payload.nickname);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all-admin-nicknames')
  async getAllAdminNicknames(): Promise<string[]> {
    return this.userRepository.getAllAdminNicknames();
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove-admin')
  async removeAdmin(@Req() request: Request): Promise<{ nickname: string }> {
    const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);
    const isUserAdmin = this.userRepository.isAdmin(payload.nickname);

    if (!isUserAdmin) return;

    return this.userRepository.removeAdmin(request.body.nickname);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-admin')
  async addAdmin(@Req() request: Request): Promise<{ nickname: string }> {
    const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);
    const isUserAdmin = this.userRepository.isAdmin(payload.nickname);

    if (!isUserAdmin) return;

    return this.userRepository.addAdmin(request.body.nickname);
  }
}
