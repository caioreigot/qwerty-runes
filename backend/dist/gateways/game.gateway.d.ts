import { Server, Socket } from 'socket.io';
import { OnGatewayInit } from '@nestjs/websockets';
import { MiniGameType } from '../models/mini-game';
import { GameRoomsService } from './game-rooms.service';
import { GeneralKnowledgeService } from './general-knowledge.service';
export declare class GameGateway implements OnGatewayInit {
    private gameRoomsService;
    private generalKnowledgeService;
    server: Server;
    constructor(gameRoomsService: GameRoomsService, generalKnowledgeService: GeneralKnowledgeService);
    afterInit(server: Server): void;
    createRoom(client: Socket, data: {
        nickname: string;
        miniGameType: MiniGameType;
    }): void;
    enterRoom(client: Socket, data: {
        nickname: string;
        roomCode: string;
    }): void;
    toggleReady(client: Socket): void;
    exit(client: Socket): void;
    answer(client: Socket, data: {
        answer: string;
    }): void;
    confirmQuestionReceived(client: Socket, data: {
        id: number;
    }): void;
}
