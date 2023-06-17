import { GeneralKnowledgeRepository } from '../repositories/general-knowledge-repository';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameRoomsService } from './game-rooms.service';
import { GeneralKnowledgeGameState } from 'src/models/general-knowledge/gk-game-state';
import { MiniGameRoom } from 'src/models/mini-game-room';
import { GeneralKnowledgeQuestionType } from 'src/models/general-knowledge/gk-question-type';
import { Player } from 'src/models/player';

@Injectable()
export class GeneralKnowledgeService {
  constructor(private generalKnowledgeRepository: GeneralKnowledgeRepository) {}

  confirmQuestionReceived(server: Server, socket: Socket, questionId: number) {
    // Acha a sala em que o socket está conectado
    const room = GameRoomsService.rooms.find((room) => {
      return socket.rooms.has(room.code);
    });

    // Se o mini-jogo for o de "conhecimento geral"
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
        roomState.public.correctAnswer = acceptableAnswers[0];
        server.to(room.code).emit('state-changed', room.state.public);

        setTimeout(() => {
          this.sendNewQuestionOrFinishGame(server, room);
        }, 4000);

        clearInterval(decrementer);
        return;
      }

      roomState.public.timerInSeconds--;
      server.to(room.code).emit('state-changed', room.state.public);
    }, 1000);
  }

  async sendNewQuestionOrFinishGame(server: Server, room: MiniGameRoom) {
    if (!(room.state instanceof GeneralKnowledgeGameState)) return;

    // Se não houver mais questões para serem exibidas, então o jogo acabou
    if (room.state.boardQuestionsIdQueue.length === 0) {
      server.to(room.code).emit('game-ended');
      return;
    }

    room.state.boardQuestionsIdQueue[0];
    const question = await this.generalKnowledgeRepository.getQuestion(
      room.state.boardQuestionsIdQueue[0],
    );

    if (!question) return;

    // Retira o ID que foi atualmente usado
    room.state.boardQuestionsIdQueue.splice(0, 1);

    room.state.public.correctAnswer = null;
    room.state.public.playersAnsweredCorrectly = [];
    room.state.currentAcceptableAnswers = question.acceptableAnswers;

    room.state.public.board = {
      id: question.id,
      questionTitle: question.questionTitle,
      type: question.type as GeneralKnowledgeQuestionType,
      content: question.content,
    };

    server.to(room.code).emit('state-changed', room.state.public);
  }

  receiveAnswer(server: Server, socket: Socket, answer: string) {
    GameRoomsService.rooms.forEach((room) => {
      if (!(room.state instanceof GeneralKnowledgeGameState)) return;

      const targetNickname = room.state.public.players.find(
        (player: Player) => player.socketId == socket.id,
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
              const roomState = room.state as GeneralKnowledgeGameState;

              // Se não foi o primeiro jogador a adivinhar, perde 1 ponto do total ao acertar
              if (roomState.public.playersAnsweredCorrectly.length >= 1) {
                scoreboardItem.score += Math.max(roomState.public.timerInSeconds - 1, 1);
              } else {
                scoreboardItem.score += roomState.public.timerInSeconds;
              }

              roomState.public.playersAnsweredCorrectly.push(targetNickname);
              scoreboardItem.lastGuess = '';

              // Retorna para que o "lastGuess" não seja atribuido
              return;
            }

            scoreboardItem.lastGuess = answer;
          }
        });
      }

      server.to(room.code).emit('state-changed', room.state.public);
    });
  }
}
