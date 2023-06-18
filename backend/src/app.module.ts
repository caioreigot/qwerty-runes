import { UtilsService } from './controllers/shared/utils.service';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GatewaysModule } from './gateways/gateways.module';
import { GeneralKnowledgeRepository } from './repositories/general-knowledge-repository';
import { PrismaGeneralKnowledgeRepository } from './repositories/prisma/prisma-general-knowledge-repository';
import { UserController } from './controllers/user.controller';
import { GeneralKnowledgeController } from './controllers/general-knowledge.controller';
import { HealthzController } from './controllers/healthz.controller';

const ConfiguredServeStaticModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, 'front'),
});

const UseUserRepositoryWithPrisma = {
  provide: UserRepository,
  useClass: PrismaUserRepository,
};

const UseGeneralKnowledgeRepositoryWithPrisma = {
  provide: GeneralKnowledgeRepository,
  useClass: PrismaGeneralKnowledgeRepository,
};

@Module({
  imports: [
    AuthModule,
    GatewaysModule,
    ConfiguredServeStaticModule
  ],
  controllers: [
    UserController,
    GeneralKnowledgeController,
    HealthzController
  ],
  providers: [
    PrismaService,
    UseUserRepositoryWithPrisma,
    UseGeneralKnowledgeRepositoryWithPrisma,
    UtilsService,
  ],
  exports: [PrismaService],
})
export class AppModule {}
