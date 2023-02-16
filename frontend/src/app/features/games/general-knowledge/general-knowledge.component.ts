import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

interface GeneralKnowledgeState {
  players: string[];
  gameStarted: boolean;
  scoreboard: { 
    nickname: string;
    score: number;
    lastGuess: string;
    isReady: boolean
  }[];
} 

@Component({
  selector: 'app-general-knowledge',
  templateUrl: './general-knowledge.component.html',
  styleUrls: ['./general-knowledge.component.less']
})
export class GeneralKnowledgeComponent implements OnInit, OnDestroy {

  roomCode = '';
  gameState: GeneralKnowledgeState = {
    players: [],
    gameStarted: false,
    scoreboard: [],
  };

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
    })

    this.socket.on('state-changed', (newState: any) => {
      console.log('State changed:', newState);
      this.gameState = newState;
    })
  }

  unsubscribeToSocketEvents() {
    this.socket.removeAllListeners('room-code');
    this.socket.removeAllListeners('state-changed');
  }
}
