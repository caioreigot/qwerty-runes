import { jwtConstants } from './shared/constants';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../database/prisma.service';
import { AuthService } from './shared/auth.service';
import { LocalStrategyService } from './shared/local-strategy.service';
import { UserRepository } from '../repositories/user-repository';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository';
import { JwtStrategy } from './shared/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
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
