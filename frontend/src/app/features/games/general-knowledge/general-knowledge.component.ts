import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GeneralKnowledgeQuestionType } from '../../../core/models/GeneralKnowledgeQuestionType';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

interface Board {
  id: number;
  questionTitle: string;
  type: GeneralKnowledgeQuestionType;
  content: string;
}

interface ScoreboardItem {
  nickname: string;
  score: number;
  lastGuess: string;
  isReady: boolean
}

interface GeneralKnowledgeState {
  players: string[];
  scoreboard: ScoreboardItem[];
  playersAnsweredCorrectly: string[];
  correctAnswer: string | null;
  timerInSeconds: number;
  gameStarted: boolean;
  board: Board | null;
} 

@Component({
  selector: 'app-general-knowledge',
  templateUrl: './general-knowledge.component.html',
  styleUrls: ['./general-knowledge.component.less']
})
export class GeneralKnowledgeComponent implements OnInit, OnDestroy {

  @ViewChild('answerInput')
  answerInput: ElementRef<HTMLInputElement> | null = null;

  state: GeneralKnowledgeState = {
    players: [],
    scoreboard: [],
    board: null,
    timerInSeconds: 0,
    playersAnsweredCorrectly: [],
    gameStarted: false,
    correctAnswer: null,
  };

  roomCode: string | null = null;
  canShowQuestion = false;
  gameEnded = false;
  scoreboardOrder: { [key: string]: number } = {};
  idsConfirmed: number[] = [];

  get myNickname() {
    return this.localStorageService.getUserNickname() ?? '';
  }

  get myScoreboardItem() {
    const nickname = this.myNickname;
    if (!nickname) return;
    
    return this.state.scoreboard.find((scoreboardItem) => {
      return scoreboardItem.nickname === nickname;
    });
  }

  get winner() {
    const winner = this.state.scoreboard.reduce((accumulator: ScoreboardItem, current: ScoreboardItem) => {
      return current.score > accumulator.score ? current : accumulator;
    });

    console.log(winner);
    return winner;
  }

  get iAnsweredCorrectly() {
    return this.state.playersAnsweredCorrectly.includes(this.myNickname);
  }

  constructor(
    private socket: Socket,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscribeToSocketEvents();

    const roomCode = this.route.snapshot.queryParamMap.get('room');

    // Se não houver um código de sala na URL, é porque o player é o HOST
    if (!roomCode) {
      const miniGameType = window.location.href.split("/").pop()?.split('?')[0];

      this.socket.emit('create-room', {
        nickname: this.localStorageService.getUserNickname(),
        miniGameType
      });
    } else {
      this.roomCode = roomCode;
      this.socket.emit('request-room-state', { roomCode });
    }
  }

  onReadyButtonClick() {
    this.socket.emit('toggle-ready');
  }

  ngOnDestroy() {
    this.unsubscribeToSocketEvents();
    this.socket.emit('exit');
  }

  sendAnswer(answer: string) {
    this.socket.emit('answer', { answer });
  }

  subscribeToSocketEvents() {
    this.socket.on('room-code', (roomCode: any) => {
      this.roomCode = roomCode;
    });

    this.socket.on('state-changed', (newState: GeneralKnowledgeState) => {
      this.state = newState;

      this.sortScoreboard(newState.scoreboard);

      // Se a "board" foi preenchida e o ID ainda não foi confirmado, confirma
      if (newState.board && !this.idsConfirmed.includes(newState.board.id)) {
        const questionId = newState.board.id;
        this.socket.emit('confirm-question-received', questionId);
        this.idsConfirmed.push(questionId);
      }

      // Se a resposta correta foi enviada, então é porque o tempo acabou
      if (newState.correctAnswer) {
        this.canShowQuestion = false;
      }
    });

    this.socket.on('all-sockets-ready', () => {
      this.canShowQuestion = true;
      this.answerInput?.nativeElement.focus();
    });

    this.socket.on('game-ended', () => {
      this.canShowQuestion = false;
      this.gameEnded = true;
    });
  }

  unsubscribeToSocketEvents() {
    this.socket.removeAllListeners('room-code');
    this.socket.removeAllListeners('state-changed');
  }

  sortScoreboard(scoreboard: ScoreboardItem[]) {
    scoreboard.sort((a, b) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return 0;
    }).map((scoreboardItem, index) => this.scoreboardOrder[scoreboardItem.nickname] = index);
  }
}
