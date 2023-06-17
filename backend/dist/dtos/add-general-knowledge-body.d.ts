import { GeneralKnowledgeQuestionType } from 'src/models/general-knowledge/gk-question-type';
export declare class AddGeneralKnowledgeBody {
    questionTitle: string;
    acceptableAnswers: string;
    type: GeneralKnowledgeQuestionType;
    content: string;
}
