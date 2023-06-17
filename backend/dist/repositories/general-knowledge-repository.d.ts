import { GeneralKnowledgeQuestion } from '@prisma/client';
import { GeneralKnowledgeQuestionType } from 'src/models/general-knowledge/gk-question-type';
export declare abstract class GeneralKnowledgeRepository {
    abstract addNewQuestion(questionTitle: string, acceptableAnswers: string, type: GeneralKnowledgeQuestionType, content: string, approved: boolean): Promise<void>;
    abstract getQuestion(id: number): Promise<GeneralKnowledgeQuestion>;
    abstract getFirstUnapprovedQuestionOccurrence(): Promise<GeneralKnowledgeQuestion>;
    abstract getApprovedQuestionIdentifiers(amount: number): Promise<number[]>;
    abstract approveQuestion(questionId: number, changes: Partial<GeneralKnowledgeQuestion>): Promise<GeneralKnowledgeQuestion>;
    abstract rejectQuestion(questionId: number): Promise<GeneralKnowledgeQuestion>;
}
