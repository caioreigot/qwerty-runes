import { GeneralKnowledgeQuestion } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { GeneralKnowledgeQuestionType } from '../../models/general-knowledge';
import { GeneralKnowledgeRepository } from '../general-knowledge-repository';
export declare class PrismaGeneralKnowledgeRepository implements GeneralKnowledgeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    addNewQuestion(questionTitle: string, acceptableAnswers: string, type: GeneralKnowledgeQuestionType, content: string, approved: boolean): Promise<void>;
    getQuestion(id: number): Promise<GeneralKnowledgeQuestion>;
    getApprovedQuestionIdentifiers(amount: number): Promise<number[]>;
    getFirstUnapprovedQuestionOccurrence(): Promise<GeneralKnowledgeQuestion>;
    approveQuestion(questionId: number, changes: Partial<GeneralKnowledgeQuestion>): Promise<GeneralKnowledgeQuestion>;
    rejectQuestion(questionId: number): Promise<GeneralKnowledgeQuestion>;
}
