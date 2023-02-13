import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GeneralKnowledgeQuestionType } from '../../models/general-knowledge';
import { GeneralKnowledgeRepository } from '../general-knowledge-repository';

@Injectable()
export class PrismaGeneralKnowledgeRepository
  implements GeneralKnowledgeRepository
{
  constructor(private prisma: PrismaService) {}

  async addNewQuestion(
    questionTitle: string,
    type: GeneralKnowledgeQuestionType,
    content: string,
    approved: boolean,
  ): Promise<void> {
    await this.prisma.generalKnowledgeQuestion.create({
      data: {
        questionTitle,
        type,
        content,
        approved,
      },
    });
  }
}
