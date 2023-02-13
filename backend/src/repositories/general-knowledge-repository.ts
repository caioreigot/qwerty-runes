import { GeneralKnowledgeQuestionType } from '../models/general-knowledge';

export abstract class GeneralKnowledgeRepository {
  abstract addNewQuestion(
    questionTitle: string,
    type: GeneralKnowledgeQuestionType,
    content: string,
    approved: boolean,
  ): Promise<void>;
}
