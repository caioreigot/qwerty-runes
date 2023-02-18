import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameRoomsService } from './game-rooms.service';
import { GeneralKnowledgeRepository } from '../repositories/general-knowledge-repository';
import { PrismaGeneralKnowledgeRepository } from '../repositories/prisma/prisma-general-knowledge-repository';
import { PrismaService } from '../database/prisma.service';

const UseGeneralKnowledgeRepositoryWithPrisma = {
  provide: GeneralKnowledgeRepository,
  useClass: PrismaGeneralKnowledgeRepository,
};

@Module({
  providers: [
    PrismaService,
    GameGateway,
    GameRoomsService,
    UseGeneralKnowledgeRepositoryWithPrisma,
  ],
})
export class GatewaysModule {}
