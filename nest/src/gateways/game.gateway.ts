import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MiniGameType } from 'src/models/mini-game';
import { GameRoomsService } from './game-rooms.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private gameRoomsService: GameRoomsService) {}

  afterInit(server: any) {
    this.gameRoomsService.startCleaningEmptyRoomsRoutine(server);
  }

  @SubscribeMessage('create-room')
  createRoom(client: Socket, miniGameType: MiniGameType) {
    this.gameRoomsService.createRoom(this.server, client, miniGameType);
  }

  @SubscribeMessage('enter-room')
  enterRoom(client: Socket, data: { nickname: string; roomCode: string }) {
    if (!data.roomCode || data.roomCode.length !== 4) {
      client.emit(
        'error',
        'O código da sala precisa ter exatamente 4 dígitos.',
      );
    }

    this.gameRoomsService.joinRoom(client, data.nickname, data.roomCode);
  }
}
