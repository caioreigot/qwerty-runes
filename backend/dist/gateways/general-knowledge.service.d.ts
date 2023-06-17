import { GeneralKnowledgeRepository } from '../repositories/general-knowledge-repository';
import { Server, Socket } from 'socket.io';
import { MiniGameRoom } from 'src/models/mini-game-room';
export declare class GeneralKnowledgeService {
    private generalKnowledgeRepository;
    constructor(generalKnowledgeRepository: GeneralKnowledgeRepository);
    confirmQuestionReceived(server: Server, socket: Socket, questionId: number): void;
    private splitAcceptableAnswers;
    private startDecreasingTimerAndEmit;
    sendNewQuestionOrFinishGame(server: Server, room: MiniGameRoom): Promise<void>;
    receiveAnswer(server: Server, socket: Socket, answer: string): void;
}
