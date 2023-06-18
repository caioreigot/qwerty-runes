import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './shared/constants';
import { AuthService } from './shared/auth.service';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { LocalStrategyService } from './shared/strategies/local-strategy.service';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from '../repositories/user-repository';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? jwtConstants.secret,
      signOptions: { expiresIn: '336h' },
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    AuthService,
    LocalStrategyService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
