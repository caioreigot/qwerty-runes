import { Component, OnDestroy, OnInit } from '@angular/core';
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

  roomCode = '';
  canShowQuestion = false;
  state: GeneralKnowledgeState = {
    players: [],
    scoreboard: [],
    timerInSeconds: 0,
    gameStarted: false,
    board: null,
  };

  idsConfirmed: number[] = [];

  get myScoreboardItem() {
    const nickname = this.localStorageService.getUserNickname();

    if (!nickname) return;
    
    return this.state.scoreboard.find((scoreboardItem) => {
      return scoreboardItem.nickname === nickname;
    });
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
    this.socket.emit('exit', this.localStorageService.getUserNickname());
  }

  subscribeToSocketEvents() {
    this.socket.on('room-code', (roomCode: any) => {
      this.roomCode = roomCode;
    });

    this.socket.on('state-changed', (newState: GeneralKnowledgeState) => {
      console.log('state changed:', newState);
      this.state = newState;

      if (newState.board && this.idsConfirmed.indexOf(newState.board.id) < 0) {
        const questionId = newState.board.id;
        this.socket.emit('confirm-question-received', questionId);
        this.idsConfirmed.push(questionId);
      }
    });

    this.socket.on('all-sockets-ready', () => {
      this.canShowQuestion = true;
    });
  }

  unsubscribeToSocketEvents() {
    this.socket.removeAllListeners('room-code');
    this.socket.removeAllListeners('state-changed');
  }
}
