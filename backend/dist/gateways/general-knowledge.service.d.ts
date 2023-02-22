import { GeneralKnowledgeRepository } from '../repositories/general-knowledge-repository';
import { Server, Socket } from 'socket.io';
import { MiniGameRoom } from '../models/mini-game';
export declare class GeneralKnowledgeService {
    private generalKnowledgeRepository;
    constructor(generalKnowledgeRepository: GeneralKnowledgeRepository);
    confirmQuestionReceived(server: Server, socket: Socket, questionId: number): void;
    private splitAcceptableAnswers;
    private startDecreasingTimerAndEmit;
    sendNewQuestionOrFinishGame(server: Server, room: MiniGameRoom): Promise<void>;
    receiveAnswer(server: Server, socket: Socket, answer: string): void;
}
