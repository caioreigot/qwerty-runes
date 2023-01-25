import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('loopback')
  handleEvent(client: Socket, data: string) {
    client.emit('message', data);
  }
}
