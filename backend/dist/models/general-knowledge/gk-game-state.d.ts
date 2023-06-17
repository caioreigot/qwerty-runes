import { GameState } from '../game-state';
import { GeneralKnowledgeGamePublicState } from './gk-public-state';
type Confirmation = {
    questionId: number;
    confirmedSocketIds: string[];
};
export declare class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
    timeInSecondsToAnswer: number;
    boardQuestionsIdQueue: number[];
    receiptConfirmations: Confirmation[];
    currentAcceptableAnswers: string;
    resetTimer(): void;
    constructor(hostNickname: string, hostSocketId: string);
}
export {};
