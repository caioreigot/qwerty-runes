import { GeneralKnowledgeQuestionType } from '../models/general-knowledge';
export declare class AddGeneralKnowledgeBody {
    questionTitle: string;
    acceptableAnswers: string;
    type: GeneralKnowledgeQuestionType;
    content: string;
}
