import { Injectable } from '@nestjs/common';
import { GeneralKnowledgeQuestion } from '@prisma/client';
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
    acceptableAnswers: string,
    type: GeneralKnowledgeQuestionType,
    content: string,
    approved: boolean,
  ): Promise<void> {
    await this.prisma.generalKnowledgeQuestion.create({
      data: {
        questionTitle,
        acceptableAnswers,
        type,
        content,
        approved,
      },
    });
  }

  getFirstUnapprovedQuestionOccurrence(): Promise<GeneralKnowledgeQuestion> {
    return this.prisma.generalKnowledgeQuestion.findFirst({
      where: { approved: false },
    });
  }
}
