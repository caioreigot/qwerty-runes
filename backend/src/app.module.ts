import { AuthModule } from 'src/auth/auth.module';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserController } from './controllers/user/user.controller';
import { GatewaysModule } from './gateways/gateways.module';

const ConfiguredServeStaticModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, 'front'),
});

const UseUserRepositoryWithPrisma = {
  provide: UserRepository,
  useClass: PrismaUserRepository,
};

@Module({
  imports: [AuthModule, GatewaysModule, ConfiguredServeStaticModule],
  controllers: [UserController],
  providers: [PrismaService, UseUserRepositoryWithPrisma],
  exports: [PrismaService],
})
export class AppModule {}
