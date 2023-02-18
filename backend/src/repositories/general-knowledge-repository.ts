import { GeneralKnowledgeQuestion } from '@prisma/client';
import { GeneralKnowledgeQuestionType } from '../models/general-knowledge';

export abstract class GeneralKnowledgeRepository {
  abstract addNewQuestion(
    questionTitle: string,
    acceptableAnswers: string,
    type: GeneralKnowledgeQuestionType,
    content: string,
    approved: boolean,
  ): Promise<void>;

  abstract getQuestion(id: number): Promise<GeneralKnowledgeQuestion>;
  abstract getFirstUnapprovedQuestionOccurrence(): Promise<GeneralKnowledgeQuestion>;
  abstract getQuestionIdentifiers(max: number): Promise<number[]>;

  abstract approveQuestion(
    questionId: number,
    changes: Partial<GeneralKnowledgeQuestion>,
  ): Promise<GeneralKnowledgeQuestion>;

  abstract rejectQuestion(questionId: number): Promise<GeneralKnowledgeQuestion>;
}
