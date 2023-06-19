import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from '../auth/shared/auth.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserBody } from '../dtos/user-body';
import { UserRepository } from '../repositories/user-repository';
import { LocalAuthGuard } from 'src/auth/shared/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/shared/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/shared/guards/admin.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private jwtService: JwtService
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

        throw error;
      }

      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: any): Promise<{ access_token: string }> {
    return this.authService.buildAndSendToken(
      request.user.nickname,
      request.body.remember
    );
  }

  /*
    Quando o usuário faz uma requisição GET /token-login passando o token JWT
    no header "authorization", este controlador valida o jwt e retorna código 200
    (sucesso) se o token for válido, ou forbidden se o token não for válido/expirou.
    Caso o usuário tenha a claim "renewSession" de valor "true" no payload do jwt,
    este controlador retornará um novo token que expira após 72h para o usuário
    poder usar (assim, cada vez que ele logar com o renewSession sendo true, a
    sessão continuará sendo renovada para mais 72h).
  */
  @Get('token-login')
  loginWithToken(
    @Headers('authorization') token: string,
    @Res() response: Response
  ) {
    const jwt = token.replace('Bearer ', '');

    try {
      this.jwtService.verify(jwt);
    } catch (error: any) {
      throw new ForbiddenException("O token fornecido não é válido.");
    }

    const jwtDecoded: any = this.jwtService.decode(jwt);

    // se não for para renovar o token, apenas deixa entrar
    if (!jwtDecoded.renewSession) {
      return response.status(HttpStatus.OK).send();
    }
    
    const payload = { 
      nickname: jwtDecoded.nickname,
      renewSession: true
    };

    // renova o token para durar mais 72h
    const options = { expiresIn: '72h' };
    
    response.status(HttpStatus.OK).json({
      access_token: this.jwtService.sign(payload, options),
    });
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
