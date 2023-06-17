import * as randomstring from 'randomstring';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GeneralKnowledgeRepository } from 'src/repositories/general-knowledge-repository';
import { MiniGameRoom } from 'src/models/mini-game-room';
import { GameState } from 'src/models/game-state';
import { MiniGameType } from 'src/models/mini-game-type';
import { GeneralKnowledgeGameState } from 'src/models/general-knowledge/gk-game-state';
import { GeneralKnowledgeQuestionType } from 'src/models/general-knowledge/gk-question-type';

@Injectable()
export class GameRoomsService {
  static rooms: MiniGameRoom[] = [];
  static ROOM_CODE_LENGTH = 4;

  constructor(private generalKnowledgeRepository: GeneralKnowledgeRepository) {}

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

  createRoom(server: Server, hostSocket: Socket, hostNickname: string, miniGameType: MiniGameType) {
    let iterations = 0;

    const joinRoomAndEmitCode = (roomCode: string) => {
      const newMiniGameRoom: MiniGameRoom = (function () {
        const gameState: GameState<any> = (function () {
          switch (miniGameType) {
            case MiniGameType.GENERAL_KNOWLEDGE:
              return new GeneralKnowledgeGameState(hostNickname, hostSocket.id);
            default:
              throw new Error('GameState não instanciado.');
          }
        })();

        return new MiniGameRoom(roomCode, miniGameType, gameState);
      })();

      GameRoomsService.rooms.push(newMiniGameRoom);

      hostSocket.join(roomCode);
      hostSocket.emit('room-code', roomCode);
      hostSocket.emit('state-changed', newMiniGameRoom.state.public);
    };

    while (true) {
      // Apenas uma precaução para que este loop não rode sem parada
      if (iterations > 26 ** GameRoomsService.ROOM_CODE_LENGTH) {
        const bigGeneratedRandomCode = this.generateRandomCode(6);
        joinRoomAndEmitCode(bigGeneratedRandomCode);
        break;
      }

      // Gera um código aleatório para a sala
      const roomCode = this.generateRandomCode(GameRoomsService.ROOM_CODE_LENGTH);

      const roomAlreadyCreated = Boolean(server.sockets.adapter.rooms.get(roomCode));

      // Se a sala não tiver sido criada antes, entre e envie o código ao host
      if (!roomAlreadyCreated) {
        joinRoomAndEmitCode(roomCode);
        break;
      }

      iterations++;
    }
  }

  // Faz o socket entrar em uma sala e emite o novo PublicState com o novo player
  joinRoom(server: Server, socket: Socket, nickname: string, roomCodeArg: string) {
    const roomCode = roomCodeArg.toUpperCase();

    const targetRoom = GameRoomsService.rooms.find((room) => room.code === roomCode);

    if (!targetRoom) {
      socket.emit('error', 'Esta sala não existe.');
      return;
    }

    if (targetRoom.state.public.gameStarted) {
      socket.emit('error', 'O jogo já começou nesta sala.');
      return;
    }

    for (let j = 0; j < targetRoom.state.public.players.length; j++) {
      const currentNickname = targetRoom.state.public.players[j].nickname;

      if (nickname === currentNickname) {
        socket.emit('error', 'Você já está conectado na sala.');
        return;
      }
    }

    const player = { nickname: nickname, socketId: socket.id };
    targetRoom.state.public.onPlayerJoin(player);

    socket.join(roomCode);
    socket.emit('entered-room');

    server.to(roomCode).emit('state-changed', targetRoom.state.public);
  }

  async startGame(server: Server, room: MiniGameRoom) {
    const roomToStartGame = GameRoomsService.rooms.find(
      (currentRoom) => currentRoom.code === room.code,
    );

    if (!roomToStartGame) return;
    roomToStartGame.state.public.gameStarted = true;

    if (room.state instanceof GeneralKnowledgeGameState) {
      room.state.boardQuestionsIdQueue =
        await this.generalKnowledgeRepository.getApprovedQuestionIdentifiers(20);

      const question = await this.generalKnowledgeRepository.getQuestion(
        room.state.boardQuestionsIdQueue[0],
      );

      if (!question) return;

      // Retira o ID que foi atualmente usado
      room.state.boardQuestionsIdQueue.splice(0, 1);
      room.state.currentAcceptableAnswers = question.acceptableAnswers;

      room.state.public.board = {
        id: question.id,
        questionTitle: question.questionTitle,
        type: question.type as GeneralKnowledgeQuestionType,
        content: question.content,
      };
    } else {
      throw Error('Está faltando uma implementação de início de jogo para o GameState passado.');
    }

    server.to(roomToStartGame.code).emit('state-changed', room.state.public);
  }

  /** @returns retorna a sala do mini-jogo caso todos os players estejam prontos */
  toggleReady(server: Server, socket: Socket): MiniGameRoom | null {
    // Iteração entre todos as salas de mini-jogos
    for (let i = 0; i < GameRoomsService.rooms.length; i++) {
      const room = GameRoomsService.rooms[i];

      // Iteração entre todos os players da sala
      for (let j = 0; j < room.state.public.players.length; j++) {
        const player = room.state.public.players[j];

        // Se não for o player, retorna e vai pra proxima iteração
        if (player.socketId !== socket.id) continue;

        room.state.public.toggleReady(player);
        server.to(room.code).emit('state-changed', room.state.public);

        if (room.state instanceof GeneralKnowledgeGameState) {
          const playersNotReady = room.state.public.scoreboard.filter((scoreboard) => {
            return scoreboard.isReady === false;
          });

          // Se todos os players estiverem prontos
          if (playersNotReady.length === 0) {
            return room;
          }
        }
      }
    }

    return null;
  }

  exitRoomsWhenDisconnecting(socket: Socket) {
    socket.on('disconnecting', () => {
      this.leaveAllRooms(socket);
    });
  }

  leaveAllRooms(socket: Socket) {
    GameRoomsService.rooms.forEach((room) => {
      room.state.public.players.forEach((player) => {
        // Se não for o player que está desconectando, retorna e vai pra proxima iteração
        if (player.socketId !== socket.id) return;

        // Desconecta o jogador e manda o novo estado para o frontend
        room.state.public.disconnectPlayer(player);
        socket.leave(room.code);

        socket.to(room.code).emit('state-changed', room.state.public);
      });
    });
  }

  // Remove a sala do array "rooms" desta classe
  private removeRoom(roomCode) {
    const roomIndex = GameRoomsService.rooms.findIndex((room) => room.code === roomCode);
    GameRoomsService.rooms.splice(roomIndex, 1);
  }
}
