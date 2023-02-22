import { GameState, Player, PublicState } from './mini-game';
export declare enum GeneralKnowledgeQuestionType {
    IMAGE = "image",
    TEXT = "text"
}
declare class Scoreboard {
    nickname: string;
    score: number;
    isReady: boolean;
    lastGuess: string;
}
declare class Board {
    id: number;
    questionTitle: string;
    type: GeneralKnowledgeQuestionType;
    content: string;
}
export declare class GeneralKnowledgeGamePublicState extends PublicState {
    playersAnsweredCorrectly: string[];
    correctAnswer: string | null;
    scoreboard: Scoreboard[];
    timerInSeconds: number;
    board: Board | null;
    onPlayerJoin(player: Player): void;
    toggleReady(player: Player): void;
    disconnectPlayer(player: Player): void;
}
export declare class ScoreboardItem {
    nickname: string;
    score: number;
    isReady: boolean;
    lastGuess: string;
    constructor(nickname: any);
}
export declare class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
    timeInSecondsToAnswer: number;
    boardQuestionsIdQueue: number[];
    receiptConfirmations: {
        questionId: number;
        confirmedSocketIds: string[];
    }[];
    currentAcceptableAnswers: string;
    resetTimer(): void;
    constructor(hostNickname: string, hostSocketId: string);
}
export {};
