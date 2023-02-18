import { Injectable } from '@nestjs/common';
import { GeneralKnowledgeQuestion } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { GeneralKnowledgeQuestionType } from '../../models/general-knowledge';
import { GeneralKnowledgeRepository } from '../general-knowledge-repository';

@Injectable()
export class PrismaGeneralKnowledgeRepository implements GeneralKnowledgeRepository {
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
        questionTitle: questionTitle.trim(),
        acceptableAnswers: acceptableAnswers.trim(),
        content: content.trim(),
        type,
        approved,
      },
    });
  }

  async getQuestion(id: number): Promise<GeneralKnowledgeQuestion> {
    return this.prisma.generalKnowledgeQuestion.findFirst({
      where: { id },
    });
  }

  async getQuestionIdentifiers(max: number): Promise<number[]> {
    const ids = await this.prisma.generalKnowledgeQuestion.findMany({
      select: { id: true },
      take: max,
    });

    return ids.map((obj) => obj.id);
  }

  getFirstUnapprovedQuestionOccurrence(): Promise<GeneralKnowledgeQuestion> {
    return this.prisma.generalKnowledgeQuestion.findFirst({
      where: { approved: false },
    });
  }

  approveQuestion(
    questionId: number,
    changes: Partial<GeneralKnowledgeQuestion>,
  ): Promise<GeneralKnowledgeQuestion> {
    const changesTrimmed = {};

    for (const key in changes) {
      changesTrimmed[key] = changes[key].trim();
    }

    return this.prisma.generalKnowledgeQuestion.update({
      where: { id: questionId },
      data: {
        ...changesTrimmed,
        approved: true,
      },
    });
  }

  rejectQuestion(questionId: number): Promise<GeneralKnowledgeQuestion> {
    return this.prisma.generalKnowledgeQuestion.delete({
      where: { id: questionId },
    });
  }
}
