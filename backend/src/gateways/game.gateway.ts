import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MiniGameType } from '../models/mini-game';
import { GameRoomsService } from './game-rooms.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private gameRoomsService: GameRoomsService) {}

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
    this.gameRoomsService.toggleReady(this.server, client);
  }

  @SubscribeMessage('exit')
  exit(client: Socket) {
    this.gameRoomsService.leaveAllRooms(client);
  }
}
