import * as randomstring from 'randomstring';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  GeneralKnowledgeGameState,
  GeneralKnowledgeQuestionType,
  ScoreboardItem,
} from '../models/general-knowledge';
import { MiniGameRoom, MiniGameType } from '../models/mini-game';
import { GeneralKnowledgeRepository } from 'src/repositories/general-knowledge-repository';

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
        switch (miniGameType) {
          case MiniGameType.GENERAL_KNOWLEDGE:
            const gameState = new GeneralKnowledgeGameState(hostNickname, hostSocket.id);
            return new MiniGameRoom(roomCode, miniGameType, gameState);
        }
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

  // Faz o socket entrar em uma sala e emite o novo public state com o novo player
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

    targetRoom.state.public.players.push({ nickname, socketId: socket.id });

    if (targetRoom.state instanceof GeneralKnowledgeGameState) {
      targetRoom.state.public.scoreboard.push(new ScoreboardItem(nickname));
    }

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
      room.state.boardIdQueue =
        await this.generalKnowledgeRepository.getApprovedQuestionIdentifiers(20);

      const question = await this.generalKnowledgeRepository.getQuestion(
        room.state.boardIdQueue[0],
      );

      if (!question) return;

      // Retira o ID que foi atualmente usado
      room.state.boardIdQueue.splice(0, 1);

      room.state.currentAcceptableAnswers = question.acceptableAnswers;

      room.state.public.board = {
        id: question.id,
        questionTitle: question.questionTitle,
        type: question.type as GeneralKnowledgeQuestionType,
        content: question.content,
      };

      server.to(roomToStartGame.code).emit('state-changed', room.state.public);
    }
  }

  confirmQuestionReceived(server: Server, socket: Socket, questionId: number) {
    // Acha a sala em que o socket está conectado
    const room = GameRoomsService.rooms.find((room) => {
      return socket.rooms.has(room.code);
    });

    if (room?.state instanceof GeneralKnowledgeGameState) {
      const roomReceiptConfirmations = room.state.receiptConfirmations;

      let receiptConfirmationItem = roomReceiptConfirmations.find(
        (confirmation) => confirmation.questionId === questionId,
      );

      if (!receiptConfirmationItem) {
        roomReceiptConfirmations.push({ questionId, confirmedSocketIds: [] });
        receiptConfirmationItem = roomReceiptConfirmations[roomReceiptConfirmations.length - 1];
      }

      // Adiciona o ID do socket como alguém que confirmou o recebimento da questão
      receiptConfirmationItem.confirmedSocketIds.push(socket.id);
      const players = room.state.public.players;

      let allIdsPresent = true;

      // Loop que checa se algum ID não está dentro do array de confirmações
      for (let i = 0; i < players.length; i++) {
        // Se o ID não estiver confirmado, passa o valor "false" para "allIdsPresent"
        if (!receiptConfirmationItem.confirmedSocketIds.includes(players[i].socketId)) {
          allIdsPresent = false;
          break;
        }
      }

      // Se todos os IDs estiverem presentes, envia ao frontend a confirmação de que todos receberam a questão
      if (allIdsPresent) {
        // Como a questão já foi confirmada, ela é removida do array de receiptConfirmations
        const indexToRemove = room.state.receiptConfirmations.indexOf(receiptConfirmationItem);
        room.state.receiptConfirmations.splice(indexToRemove, 1);
        room.state.resetTimer();

        // Começa a decrementar o contador
        this.startDecreasingTimerAndEmit(server, room);

        server.to(room.code).emit('all-sockets-ready');
      }
    }
  }

  private splitAcceptableAnswers(acceptableAnswers: string): string[] {
    return acceptableAnswers?.split(',').map((answer) => answer.trim()) ?? [];
  }

  private startDecreasingTimerAndEmit(server: Server, room: MiniGameRoom) {
    const decrementer = setInterval(() => {
      const roomState = room.state as GeneralKnowledgeGameState;
      const timer = roomState.public.timerInSeconds;

      if (timer <= 0) {
        const acceptableAnswers = this.splitAcceptableAnswers(roomState.currentAcceptableAnswers);

        server.to(room.code).emit('question-time-over', acceptableAnswers[0]);
        clearInterval(decrementer);
        return;
      }

      roomState.public.timerInSeconds--;
      server.to(room.code).emit('state-changed', room.state.public);
    }, 1000);
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

  receiveAnswer(server: Server, socket: Socket, answer: string) {
    GameRoomsService.rooms.forEach((room) => {
      if (!(room.state instanceof GeneralKnowledgeGameState)) return;

      const targetNickname = room.state.public.players.find(
        (player) => player.socketId == socket.id,
      )?.nickname;

      // Se o player não está nessa sala, retorna para ir para próxima iteração
      if (!targetNickname) return;

      // Transforma as respostas em lower case
      const answersLowerCase = this.splitAcceptableAnswers(room.state.currentAcceptableAnswers).map(
        (answer) => answer.toLowerCase(),
      );

      // Vê se a resposta do jogador (em lower case) bate com uma das respostas aceitaveis (em lower case)
      const playerAnsweredCorrectly = answersLowerCase.includes(answer.toLowerCase());

      if (room.state instanceof GeneralKnowledgeGameState) {
        room.state.public.scoreboard.forEach((scoreboardItem) => {
          if (scoreboardItem.nickname === targetNickname) {
            if (playerAnsweredCorrectly) {
              scoreboardItem.score += (
                room.state as GeneralKnowledgeGameState
              ).public.timerInSeconds;

              return;
            }

            scoreboardItem.lastGuess = answer;
          }
        });
      }

      server.to(room.code).emit('state-changed', room.state.public);
    });
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
