import { join } from 'path';
import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'front'),
    }),
  ],
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AppModule {}
