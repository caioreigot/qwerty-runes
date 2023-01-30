import * as randomstring from 'randomstring';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MiniGameRoom, MiniGameType } from 'src/models/mini-game';

@Injectable()
export class GameRoomsService {
  static rooms: MiniGameRoom[] = [];
  static ROOM_CODE_LENGTH = 4;

  /* Ao ser chamada, esta função verifica e remove as salas vazias
  do array "rooms" desta classe em intervalos de tempo definido */
  startCleaningEmptyRoomsRoutine(server: Server) {
    const intervalInMinutes = 5;

    setInterval(() => {
      GameRoomsService.rooms.forEach((room) => {
        const roomSize = server.sockets.adapter.rooms.get(room.code)?.size ?? 0;
        if (roomSize === 0) this.removeRoom(room.code);
      });
    }, 1000 * 60 * intervalInMinutes);
  }

  generateRandomCode(codeLength: number) {
    return randomstring
      .generate({
        length: codeLength,
        charset: 'alphabetic',
      })
      .toUpperCase();
  }

  createRoom(server: Server, hostSocket: Socket, miniGameType: MiniGameType) {
    let iterations = 0;

    const joinRoomAndEmitCode = (roomCode: string) => {
      hostSocket.join(roomCode);
      GameRoomsService.rooms.push({ code: roomCode, miniGameType });
      hostSocket.emit('room-code', roomCode);
    };

    while (true) {
      // Apenas uma precaução para que este loop não rode sem parada
      if (iterations > 26 ** GameRoomsService.ROOM_CODE_LENGTH) {
        const bigGeneratedRandomCode = this.generateRandomCode(6);
        joinRoomAndEmitCode(bigGeneratedRandomCode);
        break;
      }

      // Gera um código aleatório para a sala
      const roomCode = this.generateRandomCode(
        GameRoomsService.ROOM_CODE_LENGTH,
      );

      const roomAlreadyCreated = Boolean(
        server.sockets.adapter.rooms.get(roomCode),
      );

      // Se a sala não tiver sido criada antes, entre e envie o código ao host
      if (!roomAlreadyCreated) {
        joinRoomAndEmitCode(roomCode);
        break;
      }

      iterations++;
    }
  }

  // Faz o socket entrar em uma sala e emite o evento passando o nome do jogador que entrou
  joinRoom(socket: Socket, nickname: string, roomCode: string) {
    const roomCodeFormatted = roomCode.toUpperCase();
    socket.join(roomCodeFormatted);
    socket.to(roomCodeFormatted).emit('user-entered-room', nickname);
  }

  exitRoomsWhenDisconnecting(socket: Socket) {
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => {
        socket.to(room).emit('leaving', socket.id);
      });
    });
  }

  // Remove a sala do array "rooms" desta classe
  private removeRoom(roomCode) {
    const roomIndex = GameRoomsService.rooms.findIndex(
      (room) => room.code === roomCode,
    );

    GameRoomsService.rooms.splice(roomIndex, 1);
  }
}
