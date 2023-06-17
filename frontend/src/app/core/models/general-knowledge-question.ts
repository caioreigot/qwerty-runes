import { GeneralKnowledgeQuestionType } from "./general-knowledge-question-type";

export interface GeneralKnowledgeQuestion {
  id: number;
  questionTitle: string;
  type: GeneralKnowledgeQuestionType;
  content: string;
  acceptableAnswers: string;
  approved: boolean;
}