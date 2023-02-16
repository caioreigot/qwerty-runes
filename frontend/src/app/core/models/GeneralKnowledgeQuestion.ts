import { GeneralKnowledgeQuestionType } from "./GeneralKnowledgeQuestionType";

export interface GeneralKnowledgeQuestion {
  id: number;
  questionTitle: string;
  type: GeneralKnowledgeQuestionType;
  content: string;
  acceptableAnswers: string;
  approved: boolean;
}