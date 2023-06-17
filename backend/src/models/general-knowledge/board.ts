import { GeneralKnowledgeQuestionType } from './gk-question-type';

export class Board {
  id: number;
  questionTitle: string;
  type: GeneralKnowledgeQuestionType;
  content: string;
}
