import { Server, Socket } from 'socket.io';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { MiniGameType } from 'src/models/mini-game-type';
import { GameRoomsService } from './game-rooms.service';
import { GeneralKnowledgeService } from './general-knowledge.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    private gameRoomsService: GameRoomsService,
    private generalKnowledgeService: GeneralKnowledgeService,
  ) {}

  afterInit(server: Server) {
    this.gameRoomsService.startCleaningEmptyRoomsRoutine(server);
  }

  @SubscribeMessage('create-room')
  createRoom(client: Socket, data: { nickname: string; miniGameType: MiniGameType }) {
    this.gameRoomsService.exitRoomsWhenDisconnecting(client);
    this.gameRoomsService.createRoom(this.server, client, data.nickname, data.miniGameType);
  }

  @SubscribeMessage('enter-room')
  enterRoom(client: Socket, data: { nickname: string; roomCode: string }) {
    this.gameRoomsService.exitRoomsWhenDisconnecting(client);
    this.gameRoomsService.joinRoom(this.server, client, data.nickname, data.roomCode);
  }

  @SubscribeMessage('toggle-ready')
  toggleReady(client: Socket) {
    const room = this.gameRoomsService.toggleReady(this.server, client);

    if (room) {
      this.gameRoomsService.startGame(this.server, room);
    }
  }

  @SubscribeMessage('exit')
  exit(client: Socket) {
    this.gameRoomsService.leaveAllRooms(client);
  }

  @SubscribeMessage('answer')
  answer(client: Socket, data: { answer: string }) {
    this.generalKnowledgeService.receiveAnswer(this.server, client, data.answer);
  }

  @SubscribeMessage('confirm-question-received')
  confirmQuestionReceived(client: Socket, data: { id: number }) {
    this.generalKnowledgeService.confirmQuestionReceived(this.server, client, data.id);
  }
}
