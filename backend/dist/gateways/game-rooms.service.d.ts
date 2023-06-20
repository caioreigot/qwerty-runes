import { Server, Socket } from 'socket.io';
import { GeneralKnowledgeRepository } from 'src/repositories/general-knowledge-repository';
import { MiniGameRoom } from 'src/models/mini-game-room';
import { MiniGameType } from 'src/models/mini-game-type';
export declare class GameRoomsService {
    private generalKnowledgeRepository;
    private static readonly ROOM_CODE_LENGTH;
    static rooms: MiniGameRoom[];
    constructor(generalKnowledgeRepository: GeneralKnowledgeRepository);
    startCleaningEmptyRoomsRoutine(server: Server): void;
    generateRandomCode(codeLength: number): string;
    createRoom(server: Server, hostSocket: Socket, hostNickname: string, miniGameType: MiniGameType): void;
    joinRoom(server: Server, socket: Socket, nickname: string, roomCode: string): void;
    startGame(server: Server, room: MiniGameRoom): Promise<void>;
    toggleReady(server: Server, socket: Socket): MiniGameRoom | null;
    exitRoomsWhenDisconnecting(socket: Socket): void;
    leaveAllRooms(socket: Socket): void;
    private getRoom;
    private removeRoom;
}
